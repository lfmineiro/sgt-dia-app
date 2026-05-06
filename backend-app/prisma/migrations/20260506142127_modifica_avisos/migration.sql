/*
  Warnings:

  - You are about to drop the column `ativo` on the `avisos` table. All the data in the column will be lost.
  - Added the required column `servicoId` to the `avisos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "avisos" DROP COLUMN "ativo",
ADD COLUMN     "servicoId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "avisos_servicoId_criadoEm_idx" ON "avisos"("servicoId", "criadoEm");

-- AddForeignKey
ALTER TABLE "avisos" ADD CONSTRAINT "avisos_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
