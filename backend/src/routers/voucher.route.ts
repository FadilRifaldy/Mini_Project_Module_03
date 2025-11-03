import { Router } from "express";
import { getAllVoucher, deleteVoucher, validateVoucher, getVoucherById } from "../controllers/voucher.controller";

const route: Router = Router();

route.get("/voucher/all", getAllVoucher);
route.delete("/voucher/delete/:id", deleteVoucher);
route.post("/voucher/validate", validateVoucher);
route.get("/voucher/:id", getVoucherById)

export default route;