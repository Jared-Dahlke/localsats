-- AlterTable
ALTER TABLE "chatPaywalls" ADD COLUMN     "deletedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "deletedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "deletedDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "chatPaywalls" ADD CONSTRAINT "chatPaywalls_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
