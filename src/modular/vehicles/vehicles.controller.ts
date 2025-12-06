import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";

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
      return res.status(201).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows,
      });
    }else {
    return res.status(201).json({
      success: true,
      message: "No vehicles found",
      data: result.rows,
    });
}
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehiclesController = {
  createVehicles,
  getAllVehicles,
};
