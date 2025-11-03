import { Router } from "express";
import { createTransaction } from "../controllers/transaction.controller";

const route: Router = Router();

route.post("/create/transaction", createTransaction)

export default route;