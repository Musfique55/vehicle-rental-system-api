import express from "express";
import { initDB } from "./config/db";
import { config } from "./config";
import { authRoutes } from "./modular/auth/auth.route";
import { userRoutes } from "./modular/users/user.route";
import { vehicleRoutes } from "./modular/vehicles/vehicles.route";
import { bookingRoutes } from "./modular/bookings/booking.routes";

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

// bookings
app.use("/api/v1/bookings",bookingRoutes);

// 404 route handling
app.use((req,res) => {
    return res.status(404).json({
        success : false,
        message : "route not found",
        path : req.originalUrl
    })
})

app.listen(config.port,() => {
    console.log(`port running on ${config.port}`);
})