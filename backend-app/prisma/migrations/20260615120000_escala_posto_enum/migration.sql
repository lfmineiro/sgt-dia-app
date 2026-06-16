-- AlterTable: change escalas.posto from String to SetorLocal enum
-- Data migration: convert legacy string values to enum values

ALTER TABLE "escalas" ADD COLUMN "posto_new" "SetorLocal";

UPDATE "escalas" SET "posto_new" =
  CASE "posto"
    WHEN 'Ala 5o Piso' THEN 'ALA_5_PISO'::"SetorLocal"
    WHEN '4o Piso'     THEN 'ALA_4_PISO'::"SetorLocal"
    WHEN '3o Piso'     THEN 'ALA_3_PISO'::"SetorLocal"
    WHEN 'SegFem'      THEN 'SEG_FEM'::"SetorLocal"
    ELSE                    'ALA_5_PISO'::"SetorLocal"
  END;

ALTER TABLE "escalas" ALTER COLUMN "posto_new" SET NOT NULL;
ALTER TABLE "escalas" DROP COLUMN "posto";
ALTER TABLE "escalas" RENAME COLUMN "posto_new" TO "posto";
