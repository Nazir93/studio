# Деплой на Ubuntu VPS (Docker + Nginx)

Порядок действий после входа по SSH (например, `root@...`).

## 1. Базовые пакеты и firewall

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl git ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

## 2. Docker (официальный скрипт)

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
docker compose version
```

При нехватке RAM на этапе `npm run build` можно добавить swap (1–2 ГБ), затем повторить сборку.

## 3. Код проекта

```bash
mkdir -p /opt && cd /opt
git clone https://github.com/Nazir93/studio.git
cd studio
# дальше все команды из каталога /opt/studio
```

Если репозиторий другой — подставьте свой URL.

## 4. Переменные окружения приложения

```bash
cp frontend/.env.production.example frontend/.env.production
nano frontend/.env.production
```

Обязательно задайте:

- `NEXT_PUBLIC_SITE_URL` — `https://ваш-домен.ru` (или временно `http://IP` только для теста без HTTPS)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — для заявок с сайта
- при необходимости `NEXT_PUBLIC_YANDEX_METRIKA_ID` / `NEXT_PUBLIC_GA_ID`

Файл `frontend/.env.production` на сервере не коммитится (см. `.gitignore`).

После **любого** изменения `frontend/.env.production` пересоздайте контейнер приложения, иначе старые переменные останутся в памяти:

```bash
docker compose up -d --force-recreate nextjs
```

### Заявки в Telegram не приходят

- Убедитесь, что в контейнере есть переменные: `docker compose exec nextjs sh -c 'printenv | grep TELEGRAM'`
- **Личный чат:** вы один раз написали боту `/start` (без этого Bot API не шлёт вам сообщения).
- **Группа:** `TELEGRAM_CHAT_ID` вида `-100…`, бот добавлен в группу.
- Ошибки API смотрите в логах: `docker compose logs -f nextjs` (строки `[TELEGRAM]`).
- С сервера должен быть доступ в интернет: `docker compose exec nextjs wget -qO- https://api.telegram.org`

## 5. SSL для Nginx (иначе контейнер nginx не поднимет `:443`)

Без файлов в `nginx/ssl/` блок HTTPS не стартует.

### Заход по IP (Chrome «Неподдерживаемый сертификат» / NET::ERR_CERT_COMMON_NAME_INVALID)

Если сертификат выпущен на **hostname** или **домен**, а в браузере открываете **https://IP** — имя не совпадает, браузер **блокирует** HTTPS. Варианты:

- открывать **`http://IP`** (без S), или
- выпустить самоподписанный сертификат с **SAN = IP** (подставьте свой IP):

```bash
mkdir -p nginx/ssl
IP="ВАШ_IP_СЮДА"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/CN=$IP" \
  -addext "subjectAltName=IP:$IP"
chmod 600 nginx/ssl/privkey.pem
docker compose restart nginx
```

После этого `https://IP` всё равно будет «не доверенный» (самоподписанный), но **дойти до сайта** можно через «Дополнительные → перейти».

### Домен (без IP в браузере)

```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/CN=ваш-домен.ru"
chmod 600 nginx/ssl/privkey.pem
```

Выпуск Let’s Encrypt и редирект HTTP→HTTPS — см. `nginx/README-RU.md`.

## 6. Сборка и запуск

```bash
docker compose build --no-cache
docker compose up -d
docker compose ps
docker compose logs -f --tail=50
```

Проверка nginx: `docker compose exec nginx nginx -t`

Сайт: сначала проверьте **`http://IP`**. HTTPS по IP — только если в сертификате есть SAN с этим IP (см. раздел 5).

Если при `docker compose up` ошибка **Docker Hub pull rate limit** для образа nginx: в репозитории уже указан `public.ecr.aws/docker/library/nginx:alpine` (не Docker Hub). Выполните `git pull` и снова `docker compose pull && docker compose up -d`. Альтернатива: `docker login` на Docker Hub.

## 7. Обновление после `git push`

```bash
cd /opt/studio
git pull
docker compose build --no-cache
docker compose up -d
```

## 8. Полезно

- Логи Next.js: `docker compose logs -f nextjs`
- Перезапуск только nginx после смены сертификатов: `docker compose restart nginx`
- Домен: A-запись на публичный IP VPS (см. вывод `hostname -I` или панель хостинга)
