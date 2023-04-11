-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorAuthenticationEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "twoFactorAuthenticationSecret" TEXT;
