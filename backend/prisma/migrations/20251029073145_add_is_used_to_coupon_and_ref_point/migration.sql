-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReferralPoint" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;
