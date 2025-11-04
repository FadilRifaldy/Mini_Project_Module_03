import { Router } from "express";
import { validateCoupon } from "../controllers/coupon.controller";
const route: Router = Router();

route.post("/coupon/validate", validateCoupon);

export default route;