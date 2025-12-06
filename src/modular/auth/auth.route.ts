import { Router } from "express";
import { authController } from "./auth.controller";


const routes = Router();

routes.post("/signup",authController.createUser);
routes.post("/signin",authController.loginUser);

export const authRoutes = routes;