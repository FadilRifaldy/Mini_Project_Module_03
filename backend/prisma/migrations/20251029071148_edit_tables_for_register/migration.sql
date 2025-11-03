/*
  Warnings:

  - You are about to drop the `ReferralCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ReferralPoint" DROP CONSTRAINT "ReferralPoint_referralCode_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_referralCode_fkey";

-- DropTable
DROP TABLE "public"."ReferralCode";

-- AddForeignKey
ALTER TABLE "ReferralPoint" ADD CONSTRAINT "ReferralPoint_referralCode_fkey" FOREIGN KEY ("referralCode") REFERENCES "User"("referralCode") ON DELETE RESTRICT ON UPDATE CASCADE;
