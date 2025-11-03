import { Router } from "express";
import {
  createEvents,
  getEvents,
  deleteEvents,
  updateEvents,
  getEventsByCategoryAndLocation,
  getEventByID,
} from "../controllers/events.controller";
// import { verifyToken } from "../middleware/verify";

const route: Router = Router();

route.post("/create", createEvents);
route.get("/all", getEvents);
route.get("/filter/:category/:location", getEventsByCategoryAndLocation);
route.put("/update/:id", updateEvents);
route.delete("/delete/:id", deleteEvents);
route.get("/detail/:id", getEventByID);

export default route;
