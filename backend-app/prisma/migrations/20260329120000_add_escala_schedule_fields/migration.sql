-- Add accommodation fields to Escala
ALTER TABLE "escalas"
ADD COLUMN "quarto" TEXT,
ADD COLUMN "cama" TEXT;

CREATE INDEX "escalas_posto_turno_idx" ON "escalas"("posto", "turno");