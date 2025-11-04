import { Request, Response } from "express";
import prisma from "../prisma";


export const getMyTickets = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Belum login" });
    }

    
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.userId },
      include: { Event: true },
      orderBy: { createdAt: "desc" },
    });

    const tickets = transactions.map((t) => ({
      id: t.id,
      eventTitle: t.Event.title,
      startDate: t.Event.startDate,
      endDate: t.Event.endDate,
      totalPrice: t.totalPrice,
      status: t.transactionStatuses,
      purchasedAt: t.createdAt,
    }));

    console.log("Tickets dikirim ke frontend:", tickets.length);


    return res.status(200).json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.error("Error getMyTickets:", err);
    return res
      .status(500)
      .json({ success: false, message: "Gagal mengambil tiket" });
  }
};