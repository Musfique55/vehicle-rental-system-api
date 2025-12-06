import express from "express";
import { initDB } from "./config/db";

const app = express();
app.use(express.json());

// db init
initDB();


app.listen(4000,() => {
    console.log(`port running on ${4000}`);
})