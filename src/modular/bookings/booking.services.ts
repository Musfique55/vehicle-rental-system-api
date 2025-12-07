import { pool } from "../../config/db";
import getDays from "../../helper/countDays";

const createBooking = async (payload : Record<string,unknown>) => {
    const {customer_id,vehicle_id,rent_start_date,rent_end_date} = payload;

    const isAvailable = await pool.query(`SELECT * FROM vehicles WHERE id=$1`,[vehicle_id]);

    if(!isAvailable.rows.length){
        throw new Error("vehicle is not found");
    }else if(isAvailable.rows[0].availability_status !== "available"){
        throw new Error("vehicle is not available now");
    }

    const totalDay = getDays(rent_start_date as string,rent_end_date as string);

    const vehicle = isAvailable.rows[0];
    const total_price = vehicle.daily_rent_price * totalDay;

    const result = await pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,[customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,"active"]);

    // car status change
    await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`,["booked",vehicle.id]);

    const vehicleInfo = {
        vehicle_name : vehicle.vehicle_name,
        daily_rent_price:vehicle.daily_rent_price
    }

    return {...result.rows[0],vehicleInfo}
}

const getBookings = async () => {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result;
}

const getUserBooking = async(customer_id : string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`,[customer_id]);
    return result;
}

export const bookingServices = {
    createBooking,
    getBookings,
    getUserBooking
}