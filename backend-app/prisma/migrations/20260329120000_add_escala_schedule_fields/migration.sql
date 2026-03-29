-- Add query index for posto/turno lookups in Escala
CREATE INDEX "escalas_posto_turno_idx" ON "escalas"("posto", "turno");