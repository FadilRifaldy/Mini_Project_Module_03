import { Router } from "express";
import { getAllLocations, getEventsByLocation } from "../controllers/location.controller";
const route: Router = Router();
route.get("/location", getAllLocations);
route.get("/filter/location/:location", getEventsByLocation);
export default route;