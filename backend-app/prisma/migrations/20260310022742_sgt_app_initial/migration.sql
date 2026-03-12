-- CreateEnum
CREATE TYPE "StatusServico" AS ENUM ('EM_ANDAMENTO', 'FECHADO');

-- CreateEnum
CREATE TYPE "FuncaoGuarnicao" AS ENUM ('SGT_DIA', 'CB_DIA', 'PLANTAO', 'PERMANENCIA');

-- CreateEnum
CREATE TYPE "StatusAlteracao" AS ENUM ('NOVA', 'PENDENTE', 'RESOLVIDA');

-- CreateTable
CREATE TABLE "alunos" (
    "numero" INTEGER NOT NULL,
    "nomeGuerra" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "anoFormatura" INTEGER NOT NULL,
    "curso" TEXT,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" "StatusServico" NOT NULL DEFAULT 'EM_ANDAMENTO',

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guarnicoes" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "alunoNumero" INTEGER NOT NULL,
    "funcao" "FuncaoGuarnicao" NOT NULL,

    CONSTRAINT "guarnicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalas" (
    "id" TEXT NOT NULL,
    "guarnicaoId" TEXT NOT NULL,
    "posto" TEXT NOT NULL,
    "turno" INTEGER NOT NULL,

    CONSTRAINT "escalas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speds" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "companhia" TEXT NOT NULL,
    "recebimento" TEXT NOT NULL,
    "armamento" TEXT,
    "punidos" TEXT NOT NULL DEFAULT 'S/A',
    "materialCarga" TEXT NOT NULL DEFAULT 'S/A',
    "visitaMedica" TEXT NOT NULL DEFAULT 'S/A',
    "alunosDispensa" TEXT NOT NULL DEFAULT 'S/A',
    "refeicoes" TEXT NOT NULL DEFAULT 'S/A',
    "ronda" TEXT NOT NULL DEFAULT 'S/A',
    "revistaRecolher" TEXT NOT NULL DEFAULT 'S/A',
    "ocorrencias" TEXT NOT NULL DEFAULT 'S/A',
    "passagem" TEXT NOT NULL,

    CONSTRAINT "speds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alteracoes" (
    "id" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "status" "StatusAlteracao" NOT NULL DEFAULT 'NOVA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alteracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avisos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avisos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "servicos_data_key" ON "servicos"("data");

-- AddForeignKey
ALTER TABLE "guarnicoes" ADD CONSTRAINT "guarnicoes_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarnicoes" ADD CONSTRAINT "guarnicoes_alunoNumero_fkey" FOREIGN KEY ("alunoNumero") REFERENCES "alunos"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalas" ADD CONSTRAINT "escalas_guarnicaoId_fkey" FOREIGN KEY ("guarnicaoId") REFERENCES "guarnicoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speds" ADD CONSTRAINT "speds_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alteracoes" ADD CONSTRAINT "alteracoes_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
