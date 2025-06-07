-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'PREMIUM');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "plan" "Plan",
    "userId" UUID NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
