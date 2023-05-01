-- CreateTable
CREATE TABLE "ForgotPassword" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMETZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMETZ(6) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ForgotPassword_pkey" PRIMARY KEY ("id")
);
