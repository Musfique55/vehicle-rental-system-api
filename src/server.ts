import express from "express";
import { initDB } from "./config/db";
import { config } from "./config";
import { authRoutes } from "./modular/auth/auth.route";

const app = express();
app.use(express.json());

// db init
initDB();

// auth
app.use("/api/v1/auth",authRoutes);

app.listen(config.port,() => {
    console.log(`port running on ${config.port}`);
})