/*
  Warnings:

  - You are about to drop the column `budgetMax` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `budgetMin` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Task` table. All the data in the column will be lost.
  - Added the required column `budget` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "budgetMax",
DROP COLUMN "budgetMin",
DROP COLUMN "date",
DROP COLUMN "images",
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scheduledAt" TIMESTAMP(3);
