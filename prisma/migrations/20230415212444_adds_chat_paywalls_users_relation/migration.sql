-- AddForeignKey
ALTER TABLE "chatPaywalls" ADD CONSTRAINT "chatPaywalls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
