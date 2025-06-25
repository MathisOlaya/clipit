/*
  Warnings:

  - Added the required column `stripeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeId" TEXT NOT NULL;
