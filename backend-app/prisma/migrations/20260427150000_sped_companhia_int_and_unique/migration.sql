-- Convert companhia from text to int while preserving existing rows.
ALTER TABLE "speds" ADD COLUMN "companhia_int" INTEGER;

UPDATE "speds"
SET "companhia_int" = CASE
  WHEN TRIM("companhia") IN ('1', '2') THEN TRIM("companhia")::INTEGER
  ELSE 1
END;

ALTER TABLE "speds" DROP COLUMN "companhia";
ALTER TABLE "speds" RENAME COLUMN "companhia_int" TO "companhia";
ALTER TABLE "speds" ALTER COLUMN "companhia" SET NOT NULL;

-- Restrict domain to CIA 1 or 2.
ALTER TABLE "speds"
ADD CONSTRAINT "speds_companhia_check" CHECK ("companhia" IN (1, 2));

-- Ensure one SPED per servico + companhia.
CREATE UNIQUE INDEX "speds_servicoId_companhia_key"
ON "speds"("servicoId", "companhia");
