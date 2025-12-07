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
            return sendJson(res,"Your bookings retrieved successfully",200,true,result);
        }else{
            result = await bookingServices.getBookings();
            return sendJson(res,"Bookings retrieved successfully",200,true,result);
        }
    } catch (error : any) {
        return sendJson(res,error.message,500,false);
    }
};

const updateBooking = async(req: Request, res: Response) => {
    const {bookingId} = req.params;
    const {status} = req.body;
    if(req.user!.role === "customer"){
        const result = await bookingServices.updateBookingCustomer(bookingId as string,status);
        return sendJson(res,"Booking cancelled successfully",201,true,result);
    }else{
        const result = await bookingServices.updateBookingAdmin(bookingId as string,status);
        return sendJson(res,"Booking marked as returned. Vehicle is now available",201,true,result);
    }
}

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
}
