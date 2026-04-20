-- AlterTable
ALTER TABLE "escalas"
ADD COLUMN IF NOT EXISTS "inicioPrimeiroHorario" TEXT,
ADD COLUMN IF NOT EXISTS "fimTerceiroHorario" TEXT;
