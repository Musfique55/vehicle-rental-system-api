import express from "express";
import { initDB } from "./config/db";
import { config } from "./config";
import { authRoutes } from "./modular/auth/auth.route";
import { userRoutes } from "./modular/users/user.route";
import { vehicleRoutes } from "./modular/vehicles/vehicles.route";

const app = express();
app.use(express.json());

// db init
initDB();


// auth
app.use("/api/v1/auth",authRoutes);

// users
app.use("/api/v1/users",userRoutes);

// vehicles
app.use("/api/v1/vehicles",vehicleRoutes);

app.listen(config.port,() => {
    console.log(`port running on ${config.port}`);
})