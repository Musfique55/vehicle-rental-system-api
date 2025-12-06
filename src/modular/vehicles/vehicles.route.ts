import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const routes = Router();

routes.post("/",auth("admin"),vehiclesController.createVehicles);
routes.get("/",vehiclesController.getAllVehicles);

export const vehicleRoutes = routes;