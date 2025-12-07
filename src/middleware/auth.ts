import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { pool } from "../config/db";

const auth = (...roles: ("admin" | "customer")[]) => {
  return async(req: Request, res: Response,next : NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success : false,
            message : "Unauthorized",
            status : 401
        })
    }

    const decoded = jwt.verify(token,config.jwt_secret as string) as JwtPayload;
    req.user = decoded;


    if(roles.length && !roles.includes(decoded.role)){
        return res.status(403).json({
            success : false,
            message : "Forbidden",
            status : 403
        })
    }

    const existUser = await pool.query(`SELECT * FROM users WHERE email=$1`,[decoded.email]);
    if(!existUser.rows.length){
      return res.status(404).json({
            success : false,
            message : "User not exists",
            status : 404
        })
    }

    next();

  };
};

export default auth;
