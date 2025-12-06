import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

const auth = (...roles: ("admin" | "customer")[]) => {
  return (req: Request, res: Response,next : NextFunction) => {
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

    next();

  };
};

export default auth;
