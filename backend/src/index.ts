import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import eventRouter from "./routers/events.router";

const PORT = process.env.PORT;

// define app server
const app: Application = express();

// define app basic middleware
app.use(cors()); // allow other domain to access api
app.use(express.json()); // for receive req.body

// define app main router
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("<h1>F&F Events</h1>");
});

app.use("/event", eventRouter);

// error middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(error.code || 500).send(error);
});

// run app server
app.listen(PORT, () => {
  console.log("API RUNNING", PORT);
});