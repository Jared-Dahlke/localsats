-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatPaywallId_fkey" FOREIGN KEY ("chatPaywallId") REFERENCES "chatPaywalls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
