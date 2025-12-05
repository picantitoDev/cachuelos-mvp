/*
  Warnings:

  - The values [PAGO_FISICO] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PriceStatus" AS ENUM ('SIN_PROPUESTA', 'PROPUESTO', 'ACEPTADO', 'RECHAZADO');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('TARJETA', 'YAPE', 'PLIN', 'TRANSFERENCIA');
ALTER TABLE "Payment" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "priceStatus" "PriceStatus" NOT NULL DEFAULT 'SIN_PROPUESTA',
ADD COLUMN     "proposedPrice" DOUBLE PRECISION;
