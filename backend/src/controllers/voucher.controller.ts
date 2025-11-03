import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import {PaymentMethod } from "../generated/prisma";

// get all voucher
export const getAllVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getAll = await prisma.voucher.findMany();

    res.status(200).send(getAll);
  } catch (error) {
    next(error);
  }
};

//get voucher by id
export const getVoucherById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getVoucherById = await prisma.voucher.findUnique({
      where: { id: String(req.params.id) },
    });
    res.status(200).send({
      result: getVoucherById,
    });
  } catch (error) {
    console.log(error);
  }
};

//Delete
export const deleteVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteVoucher = await prisma.voucher.delete({
      where: { id: String(req.params.id) },
    });
    res.status(200).send({
      message: "Voucher has been delete",
      result: deleteVoucher,
    });
  } catch (error) {
    console.log(error);
  }
};

// validate voucher
export const validateVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, voucherCode } = req.body;

    if (!eventId || typeof eventId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Event ID tidak valid atau wajib diisi",
      });
    }

    if (!voucherCode || typeof voucherCode !== "string") {
      return res.status(400).json({
        success: false,
        message: "Voucher Code tidak valid atau wajib diisi",
      });
    }

    if (voucherCode.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Kode voucher tidak valid",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event tidak ditemukan",
      });
    }

    const voucher = await prisma.voucher.findFirst({
      where: {
        id: { startsWith: voucherCode.toLowerCase() },
      },
    });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: "Voucher tidak ditemukan",
      });
    }

    if (voucher.eventId !== eventId) {
      return res.status(400).json({
        success: false,
        message: "Voucher tidak berlaku untuk event ini",
      });
    }

    if (typeof voucher.quantity !== "number" || voucher.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Voucher sudah habis",
      });
    }

    const now = new Date();

    if (voucher.validFrom && now < voucher.validFrom) {
      return res.status(400).json({
        success: false,
        message: "Voucher belum aktif",
      });
    }

    if (voucher.validUntil && now > voucher.validUntil) {
      return res.status(400).json({
        success: false,
        message: "Voucher sudah kadaluarsa",
      });
    }

    const discountPercentage = Number(voucher.discount) || 0;
    const originalPrice = Number(event.price) || 0;

    const finalPrice = Math.max(
      0,
      originalPrice - (originalPrice * discountPercentage) / 100
    );

    return res.status(200).json({
      success: true,
      message: "Voucher valid",
      result: {
        eventId: event.id,
        voucherId: voucher.id,
        discount: discountPercentage,
        originalPrice,
        finalPrice,
        remainingQuantity: voucher.quantity,
      },
    });
  } catch (error) {
    console.error("Error in validateVoucher:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan tak terduga",
    });
  }
};