import { Request, Response } from "express";
import { authServices } from "./auth.services";
import sendJson from "../../helper/sendJson";

const createUser = async (req: Request, res: Response) => {
  const {role,password} = req.body;
  
  const roles = ["admin","customer"];

  if(!roles.includes(role)){
   return sendJson(res,"this role is not available",400,false);
  }

  if(password.length < 6){
    return sendJson(res,"password must be minimum 6 characters",400,false);
  }

  try {
    const result = await authServices.createUser(req.body);
    return sendJson(res,"User registered successfully",201,true,result.rows[0]);
  } catch (error: any) {
    return sendJson(res,error.message,500,false);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUser(req.body);
     return sendJson(res,"Login successful",200,true,result);
    // return res.status(200).json({
    //   success: true,
    //   message: "",
    //   data: result,
    // });
  } catch (error: any) {
    return sendJson(res,error.message,500,false);
    // return res.status(500).json({
    //   success: false,
    //   message: error.message,
    //   status: 500,
    // });
  }
};

export const authController = {
  createUser,
  loginUser
};
