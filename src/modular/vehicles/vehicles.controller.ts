import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";
import sendJson from "../../helper/sendJson";

const createVehicles = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  try {
    const validTypes = ["car", "bike", "van", "SUV"];
    const validateStatus = ["available", "booked"];

    if (!validTypes.includes(type)) {
      throw new Error("this type is not available");
    }

    if (!validateStatus.includes(availability_status)) {
      throw new Error("this status is not possible");
    }

    if (daily_rent_price < 0) {
      throw new Error("rent must be positive value");
    }

    const result = await vehicleServices.createVehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    if (!result.rows.length) {
      return sendJson(res, "No vehicle found", 200, true,result.rows);
    } else {
      return sendJson(
        res,
        "Vehicles retrieved successfully",
        200,
        true,
        result.rows
      );
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehicleServices.getVehicle(vehicleId as string);
    if (!result.rows.length) {
      return sendJson(res, "No vehicle found", 404, false);
    } else {
      return sendJson(
        res,
        "Vehicle retrieved successfully",
        200,
        true,
        result.rows[0]
      );
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req:Request,res:Response) =>{
  const {vehicleId} = req.params;
  try {
    const result = await vehicleServices.updateVehicle(vehicleId as string,req.body);
    if(!result.rows.length){
      return sendJson(res,"No vehicle found to update",404,false);
    }else{
      return sendJson(res,"Vehicle updated successfully",200,true,result.rows[0]);
    }
  } catch (error : any) {
    return sendJson(res,error.message,500,false);
  }
}

const deleteVehicle = async (req: Request,res: Response) => {
  const {vehicleId} = req.params;
  try {
    const result = await vehicleServices.deleteVehicle(vehicleId as string);
    if(result.rowCount){
      return sendJson(res,"Vehicle deleted successfully",200,true);
    }else{
      return sendJson(res,"no vehicle found to delete",404,false);
    }
  } catch (error : any) {
    return sendJson(res,error.message,500,false);
  }
}

export const vehiclesController = {
  createVehicles,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
};
