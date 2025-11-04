// routes/ticket.route.ts
import { Router } from "express";
import { getMyTickets } from "../controllers/ticket.controller";
import { verifyToken } from "../controllers/auth.controller";

const route = Router();

route.get("/ticket/all", verifyToken, getMyTickets);

export default route;
