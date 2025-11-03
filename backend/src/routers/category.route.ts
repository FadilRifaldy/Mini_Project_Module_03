import { Router } from "express";
import { getAllCategories, getAllEnumCategories, getEventsByCategory } from "../controllers/category.controller";
const route: Router = Router();

route.get("/category", getAllCategories);
route.get("/all-enum-categories", getAllEnumCategories);
route.get("/filter/category/:category", getEventsByCategory);

export default route;