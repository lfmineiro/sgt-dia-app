#!/usr/bin/env bash
#
# Deploy idempotente do sgt-dia-app no servidor compartilhado.
#
# Uso:
#   ./scripts/deploy.sh                    # build com cache + up
#   DEPLOY_NOCACHE=1 ./scripts/deploy.sh   # rebuild forçado (necessário ao mudar VITE_API_URL)
#   DEPLOY_SKIP_PULL=1 ./scripts/deploy.sh # pula `git pull` (deploy local sem rede)
#
set -euo pipefail

cd "$(dirname "$0")/.."

# 1. Atualiza código (a menos que pedido para pular)
if [ "${DEPLOY_SKIP_PULL:-0}" != "1" ]; then
  echo "==> git pull"
  git pull --ff-only
fi

# 2. Garante .env
if [ ! -f .env ]; then
  echo "ERRO: arquivo .env não encontrado na raiz."
  echo "Crie a partir do template: cp .env.production.example .env && nano .env"
  exit 1
fi

# 3. Build
BUILD_FLAGS=""
if [ "${DEPLOY_NOCACHE:-0}" = "1" ]; then
  BUILD_FLAGS="--no-cache"
  echo "==> build (--no-cache)"
else
  echo "==> build"
fi
docker compose -f docker-compose.prod.yml --env-file .env build $BUILD_FLAGS

# 4. Up
echo "==> up -d"
docker compose -f docker-compose.prod.yml --env-file .env up -d

# 5. Smoke test (espera backend ficar pronto)
echo "==> aguardando backend em http://localhost:8002/healthcheck"
for i in $(seq 1 30); do
  if curl -sf http://localhost:8002/healthcheck > /dev/null; then
    echo "    backend OK"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "    AVISO: backend não respondeu após 60s. Verifique: docker compose -f docker-compose.prod.yml logs backend"
  fi
  sleep 2
done

echo
echo "==> status final"
docker compose -f docker-compose.prod.yml ps

echo
echo "Frontend: http://localhost:8001"
echo "Backend:  http://localhost:8002"
