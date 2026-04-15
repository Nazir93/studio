#!/usr/bin/env bash
# Запуск на хосте (не в контейнере). Подставьте домен и путь к репозиторию.
# Crontab: 0 3 * * * DOMAIN=example.ru REPO=/opt/studio /opt/studio/scripts/letsencrypt-renew.sh >>/var/log/letsencrypt-renew.log 2>&1
set -euo pipefail

DOMAIN="${DOMAIN:-}"
REPO="${REPO:-/opt/studio}"

if [[ -z "$DOMAIN" ]]; then
  echo "Usage: DOMAIN=ваш-домен.ru REPO=/opt/studio $0" >&2
  exit 1
fi

export WEBROOT="${REPO}/nginx/certbot-www"
LIVE="/etc/letsencrypt/live/${DOMAIN}"

certbot renew --webroot -w "$WEBROOT" --quiet

install -m 644 "${LIVE}/fullchain.pem" "${REPO}/nginx/ssl/fullchain.pem"
install -m 600 "${LIVE}/privkey.pem" "${REPO}/nginx/ssl/privkey.pem"

cd "$REPO"
docker compose restart nginx

echo "$(date -Iseconds) renewed OK for ${DOMAIN}"
