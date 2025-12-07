import { Request, Response } from "express";
import { userServices } from "./user.services";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (req?.user?.role === "customer" && req.user.id != userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      status: 403,
    });
  }
  try {
    const result = await userServices.updateUser(userId!, req.body,req?.user?.role === "admin");
    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        status: 404,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await userServices.deleteUser(userId as string);
    if(result.rowCount){
        return res.status(201).json({
          success: true,
          message: "user deleted successfully",
        });
    }else{
        return res.status(404).json({
          success: false,
          message: "user not found",
          status: 404,
        });
    }
  } catch (error : any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser
};
