-- Add schedule and accommodation fields to Escala
ALTER TABLE "escalas"
ADD COLUMN "horarioInicio" TEXT NOT NULL DEFAULT '00:00',
ADD COLUMN "horarioFim" TEXT NOT NULL DEFAULT '00:00',
ADD COLUMN "quarto" TEXT,
ADD COLUMN "cama" TEXT;

-- Remove defaults to force explicit values in new inserts
ALTER TABLE "escalas" ALTER COLUMN "horarioInicio" DROP DEFAULT;
ALTER TABLE "escalas" ALTER COLUMN "horarioFim" DROP DEFAULT;

CREATE INDEX "escalas_posto_turno_idx" ON "escalas"("posto", "turno");