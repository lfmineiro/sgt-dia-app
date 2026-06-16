# Sistema de Gestão de Serviço de Alunos e SPED 🛡️

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Plataforma centralizada para automatização e gestão de escalas de serviço e relatórios SPED, desenvolvida para o **Instituto Militar de Engenharia (IME)** no âmbito da disciplina de Laboratório de Programação III.

---

## 📖 Sumário

- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Modelo de Dados](#-modelo-de-dados)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Guia de Instalação (Local)](#-guia-de-instalação-local)
- [Guia de Deploy (Produção)](#-guia-de-deploy-produção)
- [Estrutura do Projeto](#-estrutura-do-projeto-monorepo)
- [Configuração de Ambiente](#-configuração-de-ambiente)
- [Desenvolvimento Mobile](#-desenvolvimento-mobile)
- [Equipe](#-equipe)

---

## 🌟 Visão Geral

O sistema resolve a fragmentação e a burocracia na gestão dos serviços diários dos alunos do IME. Substituindo processos manuais e descentralizados, a plataforma permite:

- **Automatização:** Geração de escalas de quartos de hora dos Plantões com suas informações.
- **Tempo Real:** Registro de alterações em alojamentos via Mobile com suporte a evidências fotográficas.
- **Conformidade:** Geração automática do relatório SPED em formato Markdown para integração direta em sistemas oficiais.

---

## 🏗️ Arquitetura do Sistema

O sistema utiliza uma arquitetura moderna baseada em micro-containers e comunicação via API RESTful.

### 🏠 Ambiente de Desenvolvimento (Local)
Otimizado para agilidade, utiliza o servidor de desenvolvimento do Vite com *Hot Module Replacement* (HMR).

```mermaid
graph LR
    User([Desenvolvedor]) --> Web[Frontend :5173 - Vite Dev]
    User --> API[Backend :3000 - TSX Watch]
    Web --> API
    API --> DB[(PostgreSQL :5433)]
```
### 🚀 Ambiente de Produção (Servidor IME)

```mermaid
graph TD
    User([Usuário / Aluno]) --> Nginx[Nginx Reverse Proxy]
    Nginx --> Web[Frontend Web - React/Vite]
    Nginx --> API[Backend API - Node.js/Express]
    Mobile[App Mobile - Expo] --> API
    API --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
    API --> Cloudinary[Cloudinary - Storage de Fotos]
```

---

## 📊 Modelo de Dados

O esquema de banco de dados foi desenhado para suportar a complexidade das escalas e a hierarquia do corpo de alunos.

```mermaid
erDiagram
    ALUNO ||--o{ MEMBRO_GUARNICAO : "é atribuído"
    SERVICO ||--|{ MEMBRO_GUARNICAO : "possui"
    SERVICO ||--o{ SPED : "gera"
    SERVICO ||--o{ ALTERACAO : "contém"
    SERVICO ||--o{ AVISO : "exibe"
    MEMBRO_GUARNICAO ||--o{ ESCALA : "executa"
    
    ALUNO {
        int numero PK
        string nomeGuerra
        string nomeCompleto
        int anoFormatura
    }
    SERVICO {
        uuid id PK
        datetime data
        string status
    }
    ALTERACAO {
        uuid id PK
        string local
        string comodo
        string descricao
        string fotoUrl
        boolean verificada
    }
    ESCALA {
        uuid id PK
        string posto
        int turno
        string quarto
    }
```

---

## 🚀 Principais Funcionalidades

### 📅 Módulo de Escala
Gestão completa das escalas diárias, definindo turnos, locais e responsabilidades para cada membro da guarnição.

### 📸 Gestão de Alterações
Registro dinâmico de ocorrências nos alojamentos (limpeza, infraestrutura, etc.) com upload de fotos via Cloudinary e monitoramento de resolução.

### 📝 Relatório SPED
Compilação automática de todos os dados do serviço (recebimento, armamento, punidos, refeições, etc.) em um formato Markdown otimizado para *copy-paste* na plataforma oficial de despachos.

---

## 🛠️ Guia de Instalação (Local)

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.
- [Node.js](https://nodejs.org/) (versão 20+ recomendada) para o módulo mobile.

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone <repo-url>
   cd sgt-dia-app
   ```

2. **Configurar Variáveis de Ambiente:**
   Crie um arquivo `.env` na pasta `backend-app/` seguindo o modelo `.env.example`.
   ```bash
   cp backend-app/.env.example backend-app/.env
   ```

3. **Subir Infraestrutura com Docker:**
   Execute o comando abaixo para iniciar o Banco de Dados, API e Frontend Web:
   ```bash
   docker-compose up -d --build
   ```

4. **Seed do Banco de Dados:**
   Para popular o sistema com dados de teste e o usuário padrão:
   ```bash
   docker exec -it sgt_dia_backend npx prisma db seed
   ```
   *Nota: O script de seed utiliza as credenciais `AUTH_LOGIN_USER` e `AUTH_LOGIN_PASSWORD` definidas no seu `.env`.*

---

## 🏛️ Guia de Deploy (Produção)

O deploy no servidor compartilhado do IME é automatizado para garantir consistência e facilidade de manutenção:

1. **Automação:** O processo é realizado através do script `./scripts/deploy.sh`. Este script automatiza o `git pull`, o build das imagens Docker e realiza um *healthcheck* para confirmar que o sistema está operacional.
2. **Infraestrutura:** A infraestrutura de produção é levantada utilizando o arquivo dedicado `docker-compose.prod.yml`, que isola o banco de dados e utiliza o Nginx como Web Server nas portas `8001` (Web) e `8002` (API).

---

## 📁 Estrutura do Projeto (Monorepo)

O projeto está organizado em um monorepo, facilitando a gestão de dependências e o compartilhamento de configurações entre os diferentes módulos:

```text
.
├── backend-app/           # API RESTful (Node.js/Express)
│   └── src/
│       ├── controllers/   # Lógica de manipulação de requisições
│       ├── services/      # Camada de regras de negócio
│       ├── routes/        # Definições de endpoints da API
│       └── schemas/       # Validação de dados (Zod)
├── frontend-app/          # Dashboard Web (React/Vite)
│   └── src/
│       ├── components/    # UI (ui/ e layout/)
│       ├── pages/         # Páginas principais
│       ├── hooks/         # Lógica de estado e efeitos
│       └── services/      # Comunicação com a API
├── mobile-app/            # Aplicativo Mobile (Expo)
├── scripts/               # Utilitários (deploy.sh, reseed.sh)
├── docker-compose.yml     # Configuração Docker (Dev)
└── docker-compose.prod.yml # Configuração Docker (Prod)
```

---

## ⚙️ Configuração de Ambiente

Abaixo as principais variáveis necessárias no arquivo `backend-app/.env`:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão com PostgreSQL | `postgresql://admin:adminpassword@localhost:5433/sped_db` |
| `JWT_SECRET` | Chave secreta para tokens JWT | `sua_chave_secreta_longa` |
| `AUTH_LOGIN_USER` | Usuário administrador padrão | `admin` |
| `AUTH_LOGIN_PASSWORD`| Senha do administrador | `senha123` |
| `CLOUDINARY_CLOUD_NAME` | Nome da conta Cloudinary | `seu_cloud_name` |
| `CLOUDINARY_API_KEY` | Chave de API do Cloudinary | `sua_api_key` |
| `CLOUDINARY_API_SECRET` | Segredo de API do Cloudinary | `seu_api_secret` |
| `CLOUDINARY_FOLDER` | Pasta para armazenamento | `sgt_dia_alteracoes` |

---

## 📱 Desenvolvimento Mobile

O módulo mobile utiliza **Expo Managed Workflow**. Para executá-lo:

1. Acesse a pasta:
   ```bash
   cd mobile-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o Metro Bundler:
   ```bash
   npx expo start
   ```
   Use o QR Code no seu celular (App Expo Go) ou um emulador Android/iOS.

---

## 👥 Equipe

Trabalho desenvolvido para a disciplina de Laboratório de Programação III - IME:

- **Álisson Nunes**
- **Nivaldo Pereira**
- **Luiz Fernando Lessa Mineiro Albuquerque**


