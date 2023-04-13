-- CreateTable
CREATE TABLE "posts" (
    "id" STRING NOT NULL,
    "mongoId" STRING,
    "lat" FLOAT8 NOT NULL,
    "lng" FLOAT8 NOT NULL,
    "type" STRING NOT NULL,
    "amount" FLOAT8 NOT NULL,
    "userId" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" STRING NOT NULL,
    "mongoId" STRING,
    "userId" STRING NOT NULL,
    "pgpPrivateKeyEncrypted" STRING,
    "pgpPublicKey" STRING,
    "email" STRING,
    "seenWelcome" BOOL NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedPrivateKeysDate" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lnurlAuthKey" (
    "id" STRING NOT NULL,
    "k1" STRING NOT NULL,
    "key" STRING,

    CONSTRAINT "lnurlAuthKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" STRING NOT NULL,
    "mongoId" STRING,
    "body" STRING NOT NULL,
    "fromUserId" STRING NOT NULL,
    "toUserId" STRING NOT NULL,
    "chatPaywallId" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seen" BOOL NOT NULL DEFAULT false,
    "postId" STRING NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatPaywalls" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "postId" STRING NOT NULL,
    "recipientUserId" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatPaywalls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "lnurlAuthKey_k1_key" ON "lnurlAuthKey"("k1");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
