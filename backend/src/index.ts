import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
// import eventRouter from "./routers/events.router";
import authRouter from "./routers/auth.router";
import cookieParser from "cookie-parser";

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

// app.use("/event", eventRouter);
app.use("/auth", authRouter);

// error middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(error.code || 500).json(error);
});

// run app server
app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});
