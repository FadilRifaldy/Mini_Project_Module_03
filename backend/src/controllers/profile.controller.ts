import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

interface UserJWTPayload extends JwtPayload {
  username: string;
  email: string;
  role: string;
}

export async function getProfile(
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

    const profile = await prisma.user.findUnique({
      where: { email: user.email },
    });

    res.status(200).json({
      username: profile?.username,
      email: profile?.email,
      refCode: profile?.referralCode,
      role: profile?.type,
      profilePic: profile?.photoProfile,
    });
  } catch (error) {
    next(error);
  }
}
