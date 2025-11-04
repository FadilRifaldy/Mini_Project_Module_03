import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username, email, password, type } = req.body;
    if (!username && !email && !password && !type) {
      throw new Error("Register Field Empty");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
        type,
      },
    });

    const refCodeExist = await prisma.user.findUnique({
      where: { referralCode: req.body.refCode },
    });
    if (refCodeExist) {
      const expired = new Date().getTime() + 7_776_000_000;
      await prisma.referralPoint.create({
        data: {
          referralCode: req.body.refCode,
          expiredAt: new Date(expired),
        },
      });

      await prisma.coupon.create({
        data: {
          userId: newUser.id,
          expiredAt: new Date(expired),
        },
      });
    }

    res.status(201).json({ message: "Register Success" });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const userExist = await prisma.user.findUnique({ where: { email } });

    if (!userExist) {
      res.status(404).json({ message: "Email atau Password Salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist!.password);

    if (!isPasswordValid) {
      res.status(404).json({ message: "Email atau Password Salah" });
    }

    const authToken = jwt.sign(
      {
        username: userExist?.username,
        email,
        role: userExist?.type,
        userId: userExist?.id,
      },
      "rahasia",
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .cookie("authToken", authToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      })
      .json({ message: "Login Berhasil", user: userExist });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res
      .status(200)
      .clearCookie("authToken")
      .json({ message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, "rahasia");
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
