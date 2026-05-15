#!/usr/bin/env bash
#
# Recarga inicial dos dados.
#
# Funcionamento normal: o seed (4 alunos da Cia 7) está embutido na migration
# `20260330183000_seed_alunos_iniciais` e é aplicado automaticamente pelo
# `npx prisma migrate deploy` que roda no boot do container do backend.
# Em condições normais você NÃO precisa rodar este script.
#
# Quando usar: para ZERAR o banco e re-popular do zero (apaga TODOS os dados!).
#
set -euo pipefail

cd "$(dirname "$0")/.."

read -r -p "Isto vai APAGAR todos os dados do banco de produção. Continuar? (digite 'SIM'): " CONFIRM
if [ "$CONFIRM" != "SIM" ]; then
  echo "Abortado."
  exit 1
fi

docker compose -f docker-compose.prod.yml exec backend npx prisma migrate reset --force --skip-seed
echo "Banco resetado e migrations (incluindo seed) reaplicadas."
