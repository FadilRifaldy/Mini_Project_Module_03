import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

interface UserJWTPayload extends JwtPayload {
  username: string;
  email: string;
  role: string;
  userId: string;
}

export async function GetEventsByEO(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Access Denied. No Token Provided" });
    }

    const user = jwt.verify(authToken, "rahasia") as UserJWTPayload;
    if (user.role !== "EventOrganizer") {
      return res.status(401).json({ message: "Access Denied" });
    }

    const eventsByEO = await prisma.event.findMany({
      where: { userId: user.userId },
    });

    if (!eventsByEO) {
      return res.status(404).json({
        success: false,
        message: "Events not found",
      });
    }
    return res.status(200).json({ eventsByEO });
  } catch (error) {
    next(error);
  }
}

export const getTransactionByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        eventId: String(req.params.id),
      },
    });

    if (!transactions) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching event detail:", error);
    next(error);
  }
};

export async function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await prisma.transaction.update({
      where: { id: req.body.id },
      data: { transactionStatuses: req.body.status },
    });
    res.status(200).json({ message: "Transaction Updated" });
  } catch (error) {
    next(error);
  }
}
