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

## 5. SSL для Nginx (иначе контейнер nginx не поднимет `:443`)

Без файлов в `nginx/ssl/` блок HTTPS не стартует. Для первого запуска — самоподписанный сертификат (потом замените на Let’s Encrypt):

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

Сайт: `http://IP` и `https://IP` (браузер предупредит о самоподписанном сертификате).

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
