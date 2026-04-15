# Деплой на Ubuntu VPS

## Про SSL, «90 дней» и оплату

- **Let's Encrypt бесплатен** — платить УЦ не нужно. Срок жизни одного выпуска сертификата **~90 дней** — это норма у LE, а не «потом платить».
- **Автообновление**: на Ubuntu пакет `certbot` ставит **systemd timer** / cron: раз в несколько месяцев запускается `certbot renew`, сертификат продлевается **без вашего участия** (пока домен указывает на сервер и открыт порт 80 или настроен DNS для плагина).
- Предложение хостинга про **только DNS (acme-записи) без автообновления** — это **обходной путь**, когда нельзя проверить домен по HTTP. У вас в проекте уже есть **HTTP-проверка** (`/.well-known/acme-challenge/`) — ею можно пользоваться и **с Docker**, и **без Docker**; это как раз путь с **автопродлением**.

Ниже два варианта: **без Docker** (как «на другом сервере»: системный Nginx + Certbot) и **с Docker** (как в `docker-compose.yml`).

---

## Вариант A — без Docker (Nginx + Certbot на хосте, авто SSL)

Подходит, если не хотите занимать 80/443 контейнером и привыкли к классической схеме.

### 1. Пакеты, firewall

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl git ufw nginx certbot python3-certbot-nginx
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

**Важно:** на этом же сервере не должно быть другого процесса на `:80` и `:443` (иначе конфликт). Если раньше поднимали Docker с пробросом портов — остановите: `cd /opt/studio && docker compose down`.

### 2. Node.js 20 (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v && npm -v
```

### 3. Код и переменные

```bash
mkdir -p /opt && cd /opt
git clone https://github.com/Nazir93/studio.git
cd studio
cp frontend/.env.production.example frontend/.env.production
nano frontend/.env.production
```

Задайте `NEXT_PUBLIC_SITE_URL=https://code1618.ru`, Telegram и т.д.

### 4. Сборка Next.js (standalone)

```bash
cd /opt/studio/frontend
npm ci
npm run build
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
```

После **каждого** `git pull` и новой сборки команды `cp -r public ...` и `cp -r .next/static ...` нужно повторить (можно оформить маленьким скриптом `deploy.sh`).

### 5. Systemd

```bash
sudo cp /opt/studio/scripts/studio-nextjs.service.example /etc/systemd/system/studio-nextjs.service
sudo nano /etc/systemd/system/studio-nextjs.service
```

Проверьте `User`, `WorkingDirectory`, `ExecStart`, `EnvironmentFile`. Рабочий каталог процесса — каталог **standalone**, где лежит `server.js`:

`WorkingDirectory=/opt/studio/frontend/.next/standalone`  
`ExecStart=/usr/bin/node /opt/studio/frontend/.next/standalone/server.js`

Выдайте права пользователю сервиса на каталоги проекта (`chown -R www-data:www-data /opt/studio/frontend` или отдельный пользователь `studio`).

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now studio-nextjs
sudo systemctl status studio-nextjs
curl -sI http://127.0.0.1:3000 | head -3
```

### 6. Nginx как reverse proxy

Пример vhost: `nginx/studio-site.example.conf` — скопируйте в `/etc/nginx/sites-available/studio`, замените `server_name`, включите сайт:

```bash
sudo ln -sf /etc/nginx/sites-available/studio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Пока без HTTPS сайт должен открываться по `http://ваш-домен` (A-запись на IP сервера).

### 7. Сертификат Let’s Encrypt (автообновление из коробки)

```bash
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Certbot сам допишет `listen 443 ssl` и пути к `/etc/letsencrypt/live/...`. Проверка продления:

```bash
sudo certbot renew --dry-run
systemctl list-timers | grep certbot
```

Платить за LE не нужно; таймер будет продлевать сертификаты.

### Заявки в Telegram не приходят (без Docker)

API `/api/leads` отвечает **503**, если бот не смог отправить сообщение. Чаще всего на сервере **нет переменных** в процессе Node или неверный чат.

1. **Файл с секретами** должен совпадать с `EnvironmentFile` в unit-файле (по умолчанию `frontend/.env.production`):

   ```bash
   sudo grep -E '^(TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID)=' /opt/studio/frontend/.env.production
   ```

   Оба ключа не должны быть пустыми. В кавычках или без — как в примере `.env.production.example`.

2. **Перезапуск после правки** `.env.production`:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart studio-nextjs
   ```

3. **Логи** (ищите `[TELEGRAM]` / `[LEAD]`):

   ```bash
   sudo journalctl -u studio-nextjs -n 80 --no-pager
   ```

4. **Личный чат:** напишите боту **`/start`**. **Группа:** `TELEGRAM_CHAT_ID` вида `-100…`, бот добавлен в группу.

5. Проверка с сервера (подставьте токен и chat id из `.env.production`):

   ```bash
   curl -sS "https://api.telegram.org/bot<TOKEN>/getMe"
   ```

### 8. Обновление после `git push`

```bash
cd /opt/studio
git pull
cd frontend
npm ci
npm run build
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
sudo systemctl restart studio-nextjs
```

---

## Вариант B — Docker + Nginx в контейнере

Порядок: firewall → Docker → клон → `frontend/.env.production` → SSL в `nginx/ssl/` → `docker compose build && up`.

Подробности по самоподписанным сертификатам и webroot для Certbot — см. **`nginx/README-RU.md`**.

Кратко: порты **80/443 у контейнера `nginx` — это нормально** для этого стека: это тот же Nginx, только в Docker. Let’s Encrypt по **HTTP-01 (webroot)** можно выпускать **с автопродлением** (`certbot renew` + копирование в `nginx/ssl/` + `docker compose restart nginx`), см. скрипт `scripts/letsencrypt-renew.sh`.

```bash
cd /opt/studio
docker compose build --no-cache
docker compose up -d
```

Обновление:

```bash
cd /opt/studio
git pull
docker compose build --no-cache
docker compose up -d
```

После смены `frontend/.env.production`:

```bash
docker compose up -d --force-recreate nextjs
```

### Заявки в Telegram не приходят

- `docker compose exec nextjs sh -c 'printenv | grep TELEGRAM'`
- Личный чат: вы написали боту `/start`
- Группа: `TELEGRAM_CHAT_ID` вида `-100…`, бот в группе
- Логи: `docker compose logs -f nextjs` (строки `[TELEGRAM]`)

---

## Полезно

| Задача | Без Docker | Docker |
|--------|------------|--------|
| Логи приложения | `journalctl -u studio-nextjs -f` | `docker compose logs -f nextjs` |
| Рестарт приложения | `systemctl restart studio-nextjs` | `docker compose restart nextjs` |
| Проверка Nginx | `nginx -t` | `docker compose exec nginx nginx -t` |

- Домен: **A-запись** на публичный IP VPS.
- Заход по **https://IP** с публичным доверенным сертификатом обычно **невозможен** (сертификаты выдают на доменное имя). Для проверки используйте **домен** или временно `http://IP`.

При нехватке RAM на `npm run build` добавьте swap 1–2 ГБ.
