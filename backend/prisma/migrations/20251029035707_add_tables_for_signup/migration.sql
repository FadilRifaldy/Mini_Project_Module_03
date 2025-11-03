-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Music', 'Education', 'Business', 'Technology', 'Sports', 'Art', 'Festival', 'Workshop', 'Conference', 'Community', 'Charity', 'Entertainment', 'Health', 'Food', 'Travel', 'Gaming', 'Fashion', 'Film', 'Literature', 'Religion');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Customer', 'EventOrganizer');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "category" "Categories",
    "title" TEXT NOT NULL,
    "imgUrl" TEXT,
    "content" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalTickets" INTEGER NOT NULL,
    "availableTickets" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "photoProfile" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/digiiidiw/image/upload/v1761573444/neon-black-profile-icon-with-bold-glowing-effects-modern-sleek-designsprofile-icon-neon-black-style-offering-unique-striking-visual-appearance_165002-8298_an5sjp.jpg',
    "referralCode" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralPoint" (
    "id" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referralPoint" INTEGER NOT NULL DEFAULT 10000,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 10000,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referralCode_fkey" FOREIGN KEY ("referralCode") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralPoint" ADD CONSTRAINT "ReferralPoint_referralCode_fkey" FOREIGN KEY ("referralCode") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
