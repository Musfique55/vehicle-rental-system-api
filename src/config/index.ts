import dotenv from "dotenv";
import path from "path";

dotenv.config({path : path.join(process.cwd(),".env")});

export const config = {
    connectionStr : process.env.CONNECTION_STR,
    port : process.env.PORT,
}