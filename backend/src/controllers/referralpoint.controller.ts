import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export const validateReferralPoint = async (req: Request, res: Response) => {
  const { userId, eventId } = req.body;

  console.log("[REFERRAL] Request:", { userId, eventId });

  if (!userId || !eventId) {
    return res.status(400).json({
      success: false,
      message: "User ID dan Event ID wajib dikirim",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, email: true },
  });

  console.log("[REFERRAL] User found:", user ? user.email : "NOT FOUND");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }

  const referral = await prisma.referralPoint.findFirst({
    where: {
      referralCode: user.referralCode,
      isUsed: false,
      expiredAt: { gt: new Date() },
    },
  });

  console.log("[REFERRAL] Referral point found:", referral);

  if (!referral) {
    console.log("[REFERRAL] No valid referral point");
    return res.status(400).json({
      success: false,
      message: "Referral point tidak valid atau sudah digunakan",
    });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });

  console.log("[REFERRAL] Event found:", event ? event.title : "NOT FOUND");

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event tidak ditemukan",
    });
  }

  const discount = referral.referralPoint;
  const finalPrice = event.price - discount;

  console.log("[REFERRAL] Discount calculated:", { discount, finalPrice });

  
  return res.json({
    success: true,
    result: { 
      discount, 
      finalPrice,
      referralId: referral.id 
    },
    message: "Referral point valid dan siap digunakan",
  });
};
