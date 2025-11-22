/*
  Warnings:

  - You are about to drop the column `auth_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_auth_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "auth_id",
ADD COLUMN     "password" TEXT NOT NULL;
