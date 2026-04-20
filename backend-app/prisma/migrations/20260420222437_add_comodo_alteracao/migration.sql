/*
  Warnings:

  - Added the required column `comodo` to the `alteracoes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `local` on the `alteracoes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SetorLocal" AS ENUM ('ALA_5_PISO', 'ALA_4_PISO', 'ALA_3_PISO', 'SEG_FEM');

-- DropIndex
DROP INDEX "escalas_posto_turno_idx";

-- AlterTable
ALTER TABLE "alteracoes" ADD COLUMN     "comodo" TEXT NOT NULL,
DROP COLUMN "local",
ADD COLUMN     "local" "SetorLocal" NOT NULL;
