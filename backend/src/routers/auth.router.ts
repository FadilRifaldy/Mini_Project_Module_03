import { Router } from "express";
import {
  login,
  register,
  verifyToken,
  logout,
} from "../controllers/auth.controller";

const route: Router = Router();

route.route("/register").post(register);
route.route("/login").post(login);
route.route("/logout").post(logout);
route.route("/verify-token").get(verifyToken);

export default route;
