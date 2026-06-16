# Deploy — sgt-dia-app (Grupo 1)

Runbook do deploy no servidor compartilhado da disciplina.

## Pré-requisitos no servidor

- Acesso SSH com usuário `grupo01`
- Docker + Docker Compose instalados (já vêm no servidor da disciplina)
- Faixa de portas reservada do Grupo 1: **8001-8010**

## Mapa de portas usadas

| Serviço | Host | Container |
|---|---|---|
| frontend (nginx) | **8001** | 80 |
| backend (Express) | **8002** | 3000 |
| db (Postgres) | (não exposto) | 5432 |

## Primeiro deploy

```bash
# 1. SSH no servidor
ssh grupo01@<servidor>

# 2. Clone do repositório (na home do grupo01)
cd ~
git clone <url-do-repo> sgt-dia-app
cd sgt-dia-app

# 3. Configura variáveis de ambiente
cp .env.production.example .env
nano .env
```

Preencha no `.env`:
- `POSTGRES_PASSWORD` — senha do Postgres (qualquer string)
- `JWT_SECRET` — chave aleatória longa (sugestão: `openssl rand -hex 32`)
- `AUTH_LOGIN_USER`, `AUTH_LOGIN_PASSWORD` — credenciais do login da app
- `CLOUDINARY_*` — credenciais reais (sem isso, upload de fotos das alterações falha em runtime; o sistema sobe normal)
- `VITE_API_URL` — trocar `CHANGE_ME` pelo IP do servidor. **Formato exato**: `http://<IP_DO_SERVIDOR>:8002/api`

```bash
# 4. Permissões dos scripts
chmod +x scripts/deploy.sh scripts/reseed.sh

# 5. Deploy
./scripts/deploy.sh

# 6. Verificar
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend   # Ctrl+C para sair
```

Se tudo der certo:
- Frontend disponível em `http://<IP>:8001`
- Backend disponível em `http://<IP>:8002`
- Login com as credenciais que você definiu em `AUTH_LOGIN_USER`/`AUTH_LOGIN_PASSWORD`
- Tela de alunos já vem com 4 alunos (carga inicial via migration de seed)

## Atualizações futuras

```bash
cd ~/sgt-dia-app
./scripts/deploy.sh
```

O script faz `git pull` + rebuild incremental + `up -d`.

## Mudou o IP/host do servidor (`VITE_API_URL`)?

Vite **embute** as variáveis `VITE_*` no bundle JS no momento do build — não em runtime. Trocar a URL exige rebuild forçado:

```bash
nano .env                              # atualiza VITE_API_URL
DEPLOY_NOCACHE=1 ./scripts/deploy.sh   # força rebuild
```

## Carga inicial de dados

O seed (4 alunos) está embutido em uma migration Prisma (`prisma/migrations/20260330183000_seed_alunos_iniciais/`) e roda automaticamente no boot do container (via `npx prisma migrate deploy` no `CMD` do `Dockerfile.prod`). Não há ação manual necessária.

Para **re-popular do zero** (apaga TUDO):

```bash
./scripts/reseed.sh
```

## Comandos úteis

```bash
# logs
docker compose -f docker-compose.prod.yml logs -f             # todos
docker compose -f docker-compose.prod.yml logs -f backend     # só backend

# status
docker compose -f docker-compose.prod.yml ps

# parar (mantém volumes/dados)
docker compose -f docker-compose.prod.yml down

# parar e APAGAR dados (cuidado!)
docker compose -f docker-compose.prod.yml down -v

# reiniciar um serviço
docker compose -f docker-compose.prod.yml restart backend

# entrar no container do backend (debug)
docker compose -f docker-compose.prod.yml exec backend sh

# entrar no Postgres (debug)
docker compose -f docker-compose.prod.yml exec db psql -U admin -d sped_db
```

## Validação fim-a-fim

| Passo | Comando | Esperado |
|---|---|---|
| 1 | `docker compose -f docker-compose.prod.yml ps` | 3 services `running`, db `healthy` |
| 2 | `curl http://localhost:8002/healthcheck` | `{"status":"ok",...}` |
| 3 | `curl http://localhost:8002/status` | `"database":"connected"` |
| 4 | `docker compose -f docker-compose.prod.yml exec db psql -U admin -d sped_db -c "SELECT COUNT(*) FROM alunos;"` | `4` |
| 5 | `curl -I http://localhost:8001/` | `HTTP/1.1 200 OK` |
| 6 | `curl -I http://localhost:8001/qualquer/rota` | `200` (SPA fallback) |
| 7 | Browser: `http://<IP>:8001`, login com `AUTH_LOGIN_*` | Telas carregam, DevTools mostra requests para `:8002/api/...` |

## Não confundir com o ambiente de DEV

O ambiente local de desenvolvimento continua igual:

```bash
docker compose up    # usa docker-compose.yml (DEV) — portas 3000/5173/5433
```

São arquivos completamente separados:
- DEV: `docker-compose.yml`, `backend-app/Dockerfile`, `frontend-app/Dockerfile`
- PROD: `docker-compose.prod.yml`, `backend-app/Dockerfile.prod`, `frontend-app/Dockerfile.prod`

Os volumes também são separados (`pgdata` vs `pgdata_prod`), então um ambiente não interfere no outro mesmo rodando na mesma máquina.

## Riscos conhecidos

- **CORS aberto**: `app.use(cors())` no backend aceita qualquer origem. OK para escopo de faculdade.
- **Cloudinary obrigatório para upload**: backend sobe normal sem credenciais; só falha quando tentar enviar foto.
- **`docker compose down -v` apaga o banco**: usar `down` (sem `-v`) para parar mantendo dados.
- **Backup**: não há rotina automática de `pg_dump`. Se necessário: `docker compose -f docker-compose.prod.yml exec db pg_dump -U admin sped_db > backup.sql`.
