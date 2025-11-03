import { Router } from "express";
import { login, register, verifyToken } from "../controllers/auth.controller";

const route: Router = Router();

route.route("/register").post(register);
route.route("/login").post(login);
route.route("/verify-token").get(verifyToken);

export default route;
