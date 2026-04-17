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

Заявки в Telegram: переменные в **`frontend/.env.production`** (если строки **пустые** — берутся значения из кода в `telegram.ts`). После правки — **`sudo systemctl restart studio-nextjs`**.

- В **личку** боту обязательно **`/start`** иначе API вернёт «chat not found» / «bot was blocked».
- Для **группы**: `TELEGRAM_CHAT_ID=-100…`, бот добавлен в группу и не удалён.
- Не работает — смотрите лог: **`sudo journalctl -u studio-nextjs -n 100 --no-pager | grep -E 'TELEGRAM|LEAD'`** (там текст ошибки от Telegram).

Мало RAM на `npm run build` — добавьте swap 1–2 ГБ.

---

## Docker

В репозитории есть `docker-compose.yml`; описанный здесь прод **без контейнеров**.
