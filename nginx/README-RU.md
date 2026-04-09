# Nginx + SSL для проекта (Docker)

Веб-сервер **nginx** принимает трафик на портах **80** и **443** и проксирует его в контейнер **Next.js** (`nextjs:3000`).

## Что уже настроено

- **Порт 80** — прокси на приложение и каталог для проверки **Let’s Encrypt** (`/.well-known/acme-challenge/` → `./nginx/certbot-www` на хосте).
- **Порт 443** — HTTPS, сертификаты читаются из `./nginx/ssl/`:
  - `fullchain.pem` — полная цепочка (или один файл сертификата от УЦ).
  - `privkey.pem` — приватный ключ.

Файлы в `nginx/ssl/` **не коммитятся** (см. корневой `.gitignore`).

## Перед первым запуском с HTTPS

Без файлов сертификата nginx **не запустит** блок `:443`. Варианты:

### Вариант A — временный самоподписанный (тест)

На сервере (Linux), из корня репозитория:

```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/CN=ваш-домен.ru"
```

Потом замените файлы на выпущенные УЦ или Let’s Encrypt.

### Вариант B — Let’s Encrypt (Certbot, webroot)

1. Убедитесь, что **домен** указывает на IP сервера, порты **80/443** открыты.
2. Поднимите стек так, чтобы nginx отдавал `/.well-known/acme-challenge/` (конфиг уже содержит `location` и volume `certbot-www`).
3. На хосте (не обязательно в Docker), если установлен certbot:

```bash
certbot certonly --webroot -w "$(pwd)/nginx/certbot-www" \
  -d ваш-домен.ru -d www.ваш-домен.ru
```

4. Скопируйте (или смонтируйте) выпущенные файлы:

- обычно `fullchain.pem` и `privkey.pem` из `/etc/letsencrypt/live/ваш-домен.ru/`  
  → в `./nginx/ssl/fullchain.pem` и `./nginx/ssl/privkey.pem`.

5. Перезапуск: `docker compose restart nginx`.

### Вариант C — сертификат от УЦ «с вашей стороны»

Положите выданные файлы в `nginx/ssl/`, переименовав под имена выше (или поправьте пути в `nginx.conf` в блоке `server { listen 443 ssl; ... }`).

## Редирект HTTP → HTTPS (после рабочего HTTPS)

Когда сертификат выпущен и сайт открывается по `https://`, в блоке `server { listen 80; ... }` в `nginx.conf` **замените** включение сниппета на редирект, например:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/certbot;
    allow all;
}

location / {
    return 301 https://$host$request_uri;
}
```

(Обновление сертификата Let’s Encrypt через webroot снова потребует временно вернуть прокси на `:80` или использовать `certbot renew` с тем же webroot — см. документацию certbot.)

## Проверка

```bash
docker compose exec nginx nginx -t
docker compose restart nginx
```

## Переменные приложения

Для корректных ссылок и редиректов в Next.js задайте публичный URL, например в `.env` / `.env.production`:

`NEXT_PUBLIC_SITE_URL=https://ваш-домен.ru`
