import { Request, Response } from "express";
import { authServices } from "./auth.services";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUser(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

export const authController = {
  createUser,
  loginUser
};
