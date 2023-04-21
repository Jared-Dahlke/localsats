/*
  Warnings:

  - You are about to drop the column `deletedDate` on the `chatPaywalls` table. All the data in the column will be lost.
  - You are about to drop the column `deletedDate` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `deletedDate` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chatPaywalls" DROP COLUMN "deletedDate";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "deletedDate";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "deletedDate";
