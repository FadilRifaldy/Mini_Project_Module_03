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
  } catch (error) {
    next(error);
  }
}
