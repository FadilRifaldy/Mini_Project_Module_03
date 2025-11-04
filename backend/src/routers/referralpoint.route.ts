import { Router } from "express";
import { validateReferralPoint } from "../controllers/referralpoint.controller";
const route: Router = Router();

route.post("/referral/validate", validateReferralPoint);

export default route;