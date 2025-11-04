import { Router } from "express";
import { getProfile } from "../controllers/profile.controller";

const route: Router = Router();

route.route("/").get(getProfile);

export default route;
