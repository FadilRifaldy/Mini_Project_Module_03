import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import {PaymentMethod } from "../generated/prisma";


// create transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { eventId, totalPrice, paymentMethod, paymentProof, voucherUsed } =
      req.body;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID wajib diisi" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { Voucher: true },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event tidak ditemukan" });
    }

    //
    const validMethods = Object.values(PaymentMethod);
    if (paymentMethod && !validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Payment method tidak valid. Gunakan salah satu dari: ${validMethods.join(
          ", "
        )}.`,
      });
    }

    if (event.availableTickets <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Tiket sudah habis" });
    }

    if (voucherUsed && event.Voucher && event.Voucher.quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Voucher sudah habis" });
    }

    
    const [transactionResult] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          eventId,
          totalPrice: Number(totalPrice) || event.price,
          paymentMethod: paymentMethod || PaymentMethod.TRANSFER,
          paymentProof: paymentProof || "",
        },
      }),

      prisma.event.update({
        where: { id: eventId },
        data: { availableTickets: { decrement: 1 } },
      }),

      
      ...(voucherUsed && event.Voucher
        ? [
            prisma.voucher.update({
              where: { id: event.Voucher.id },
              data: { quantity: { decrement: 1 } },
            }),
          ]
        : []),
    ]);

    return res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      result: transactionResult,
    });
  } catch (error) {
    console.error("Error saat membuat transaksi:", error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};
