# Деплой на Ubuntu VPS (без Docker)

Схема: **Nginx** → **Next.js standalone** (systemd) → **HTTPS** (Certbot).

---

## Обновление с гита (основной цикл)

Выполняйте **после каждого `git push`** на сервере:

```bash
cd /opt/studio
git pull
cd frontend
npm ci
npm run build
sudo chown -R www-data:www-data /opt/studio/frontend/.next/standalone
sudo systemctl restart studio-nextjs
```

- **`chown`** нужен, если `npm run build` идёт под **root**, а сервис в systemd с **`User=www-data`**. Без этого **`next/image`** не создаёт кэш → **EACCES** в логах.
- Сборка только через **`npm run build`** (из каталога `frontend`): скрипт **`build`** сам вызывает копирование **`public`** и **`.next/static`** в **`.next/standalone`**. Если запустить голый **`next build`** без этого шага — сайт откроется **без CSS/JS**. После деплоя сделайте жёсткое обновление страницы (Ctrl+F5), если видели «старый» интерфейс из кэша.

Проверка:

```bash
curl -sI http://127.0.0.1:3000 | head -3
sudo systemctl status studio-nextjs --no-pager
```

---

## Сайт на сервере без CSS / «голый» HTML (на localhost всё ок)

**Причина:** в режиме **`output: "standalone"`** Next.js кладёт в **`.next/standalone`** только сервер. Стили и чанки лежат в **`.next/static`**; картинки и `favicon` — в **`public/`**. Их **докладывает** скрипт **`scripts/copy-standalone-assets.mjs`**, он вызывается **только** из **`npm run build`** (не из голого `next build`).

**На сервере проверьте** (пути подставьте свои, ниже — как в примере):

```bash
cd /opt/studio/frontend
# Должны существовать и быть непустыми:
ls -la .next/standalone/.next/static/chunks 2>/dev/null | head -5
ls -la .next/standalone/public 2>/dev/null | head -5
```

Если каталогов **нет** или **пусто** — пересоберите **из `frontend`**:

```bash
cd /opt/studio/frontend
rm -rf .next
npm ci
npm run build
```

В логе сборки в конце должны быть строки **`[copy-standalone-assets] OK: public →`** и **`OK: .next/static →`**. Затем:

```bash
sudo chown -R www-data:www-data /opt/studio/frontend/.next/standalone
sudo systemctl restart studio-nextjs
```

**Ещё проверьте:** в **`/etc/systemd/system/studio-nextjs.service`** у сервиса **`WorkingDirectory`** и **`ExecStart`** указывают на **`…/frontend/.next/standalone`** и **`server.js`** именно там, а не на старую копию проекта.

После исправления в браузере сделайте **жёсткое обновление** (Ctrl+F5), чтобы не подтянуть старый HTML с прежними путями к `_next/static`.

---

## Первая установка (один раз)

**Пакеты и firewall**

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl git ufw nginx certbot python3-certbot-nginx
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable
```

**Node.js 20**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

**Клон и env**

```bash
cd /opt && git clone https://github.com/Nazir93/studio.git
cp /opt/studio/frontend/.env.production.example /opt/studio/frontend/.env.production
nano /opt/studio/frontend/.env.production
```

Укажите `NEXT_PUBLIC_SITE_URL`, Telegram и остальное.

**Сборка и права** — те же команды, что в блоке «Обновление с гита» (из `/opt/studio/frontend` после `npm ci`).

**systemd**

```bash
sudo cp /opt/studio/scripts/studio-nextjs.service.example /etc/systemd/system/studio-nextjs.service
sudo nano /etc/systemd/system/studio-nextjs.service
```

Проверьте: **`WorkingDirectory`**, **`ExecStart`** → `server.js` в standalone, **`EnvironmentFile`** → `.env.production`, **`User=www-data`**.

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now studio-nextjs
```

**Nginx** — по примеру `nginx/studio-site.example.conf` в `sites-available`, symlink в `sites-enabled`, затем:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

**Сертификат**

```bash
sudo certbot --nginx -d code1618.ru -d www.code1618.ru
```

---

## Если что-то не так

| Что | Команда |
|-----|---------|
| Логи приложения | `sudo journalctl -u studio-nextjs -n 80 --no-pager` |
| Рестарт | `sudo systemctl restart studio-nextjs` |
| Проверка Nginx | `sudo nginx -t` |

Заявки в Telegram: **`TELEGRAM_BOT_TOKEN`** и **`chat_id`** задаются **только в коде** — **`frontend/src/lib/telegram.ts`**. Переменные окружения для бота **не читаются** (строки в `.env` на это не влияют). После смены токена — **`git pull`**, **`npm run build`**, **`chown`** на standalone, **`sudo systemctl restart studio-nextjs`**.

- Проверка: откройте **`/brief`**, отправьте форму — при успехе **`/spasibo`** и сообщение в Telegram.
- Ошибка **503**: F12 → **Сеть** → запрос **`leads`** → **`hint`** / **`code`**; на сервере — **`journalctl`** (см. таблицу).
- В **личку** боту **`/start`**; для **группы** укажите id вида **`-100…`** в **`telegram.ts`**, бот в группе.
- Логи: **`sudo journalctl -u studio-nextjs -n 100 --no-pager | grep -E 'TELEGRAM|LEAD'`**

Мало RAM на `npm run build` — добавьте swap 1–2 ГБ.

---

## Docker

В репозитории есть `docker-compose.yml`; описанный здесь прод **без контейнеров**.
