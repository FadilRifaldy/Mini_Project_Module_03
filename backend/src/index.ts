import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import authRouter from "./routers/auth.router";
import cookieParser from "cookie-parser";
import eventRouter from "./routers/events.route";
import categoryRouter from "./routers/category.route";
import locationRouter from "./routers/location.route";
import transactionRouter from "./routers/transaction.route";
import voucherRouter from "./routers/voucher.route";
import couponRouter from "./routers/coupon.route";
import referralRouter from "./routers/referralpoint.route";
import profileRouter from "./routers/profile.route";
import ticketRouter from "./routers/ticket.route"

const PORT = process.env.PORT;

// define app server
const app: Application = express();

// define app basic middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // allow other domain to access api
app.use(express.json()); // for receive req.body
app.use(cookieParser());

// define app main router
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>F&F Events</h1>");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/events", eventRouter);
app.use("/categories", categoryRouter);
app.use("/locations", locationRouter);
app.use("/transactions", transactionRouter);
app.use("/vouchers", voucherRouter);
app.use("/coupons", couponRouter);
app.use("/referrals", referralRouter);
app.use("/tickets", ticketRouter)


// error middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  const statusCode = 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// run app server
app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});
