-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('Music', 'Education', 'Business', 'Technology', 'Sports', 'Art', 'Festival', 'Workshop', 'Conference', 'Community', 'Charity', 'Entertainment', 'Health', 'Food', 'Travel', 'Gaming', 'Fashion', 'Film', 'Literature', 'Religion');

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
