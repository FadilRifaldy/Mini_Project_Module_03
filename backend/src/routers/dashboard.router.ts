import { Router } from "express";
import {
  GetEventsByEO,
  getTransactionByID,
  updateTransaction,
} from "../controllers/dashboard.controller";

const route: Router = Router();

route.route("/").get(GetEventsByEO);
route.route("/:id").get(getTransactionByID);
route.route("/update-transaction").patch(updateTransaction);

export default route;
