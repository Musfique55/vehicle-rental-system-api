import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const routes = Router();

routes.post("/",auth("admin"),vehiclesController.createVehicles);
routes.get("/",auth("admin","customer"),vehiclesController.getAllVehicles);
routes.get("/:vehicleId",auth("admin","customer"),vehiclesController.getVehicle);
routes.put("/:vehicleId",auth("admin"),vehiclesController.updateVehicle);
routes.delete("/:vehicleId",auth("admin"),vehiclesController.deleteVehicle);

export const vehicleRoutes = routes;