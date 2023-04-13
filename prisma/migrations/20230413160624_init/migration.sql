/*
  Warnings:

  - You are about to drop the column `mongoId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `mongoId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `mongoId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "mongoId";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "mongoId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "mongoId";
