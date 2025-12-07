import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import sendJson from "../../helper/sendJson";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);
        return sendJson(res,"Booking created successfully",201,true,result);
    } catch (error : any) {
        return sendJson(res,error.message,500,false);
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        let result;
        if(req?.user?.role === "customer"){
            result = await bookingServices.getUserBooking(req.user.id);
        }else{
            result = await bookingServices.getBookings();
        }
        return sendJson(res,"Bookings retrieved successfully",200,true,result.rows);
    } catch (error : any) {
        return sendJson(res,error.message,500,false);
    }
};



export const bookingController = {
    createBooking,
    getAllBookings
}
