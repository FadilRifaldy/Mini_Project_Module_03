import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export const validateCoupon = async (req: Request, res: Response) => {
  const { userId, eventId } = req.body;

  console.log("[COUPON] Request:", { userId, eventId });

  if (!userId || !eventId) {
    console.log("[COUPON] Missing fields");
    return res.status(400).json({
      success: false,
      message: "User ID dan Event id wajib dikirim",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  console.log("[COUPON] User found:", user ? user.email : "NOT FOUND");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }

  const coupon = await prisma.coupon.findFirst({
    where: {
      userId: user.id,
      isUsed: false,
      expiredAt: { gt: new Date() },
    },
  });

  console.log("[COUPON] Coupon found:", coupon);

  if (!coupon) {
    console.log("[COUPON] No valid coupon");
    return res.status(400).json({
      success: false,
      message: "Kupon tidak valid atau sudah digunakan",
    });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });

  console.log("[COUPON] Event found:", event ? event.title : "NOT FOUND");

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event tidak ditemukan",
    });
  }

  const discount = coupon.discount;
  const finalPrice = event.price - discount;

  console.log("[COUPON] Discount calculated:", { discount, finalPrice });
  
  return res.json({
    success: true,
    result: { 
      discount, 
      finalPrice,
      couponId: coupon.id 
    },
    message: "Kupon valid dan siap digunakan",
  });
};
