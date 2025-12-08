import { pool } from "../../config/db";
import getDays from "../../helper/countDays";
import { userServices } from "../users/user.services";
import { vehicleServices } from "../vehicles/vehicles.services";

const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const checkDate =
    new Date(rent_start_date as string) < new Date(rent_end_date as string);

  if (!checkDate) {
    throw new Error("end date must be after start date");
  }

  const isAvailable = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (!isAvailable.rows.length) {
    throw new Error("vehicle is not found");
  } else if (isAvailable.rows[0].availability_status !== "available") {
    throw new Error("vehicle is not available now");
  }

  const totalDay = getDays(rent_start_date as string, rent_end_date as string);

  const vehicle = isAvailable.rows[0];
  const total_price = vehicle.daily_rent_price * totalDay;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  // car status change
  await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
    "booked",
    vehicle.id,
  ]);

  const vehicleInfo = {
    vehicle_name: vehicle.vehicle_name,
    daily_rent_price: vehicle.daily_rent_price,
  };

  return { ...result.rows[0], vehicleInfo };
};

const getBookings = async () => {
  const result = (await pool.query(`SELECT * FROM bookings`)).rows;
  const bookingWithData = await Promise.all(
    result.map(async (booking) => {
      const thisCustomer = (
        await userServices.getSingleUser(booking.customer_id)
      ).rows[0];
      const thisVehicle = (await vehicleServices.getVehicle(booking.vehicle_id))
        .rows[0];
      const customer = {
        name: thisCustomer.name,
        email: thisCustomer.email,
      };
      const vehicle = {
        vehicle_name: thisVehicle.vehicle_name,
        registration_number: thisVehicle.registration_number,
      };
      return { ...booking, customer, vehicle };
    })
  );
  return bookingWithData;
};

const getUserBooking = async (customer_id: string) => {
  const result = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1`,
    [customer_id]
  );
  delete result.rows[0].customer_id;
  const thisVehicle = (
    await vehicleServices.getVehicle(result.rows[0].vehicle_id)
  ).rows[0];
  const vehicle = {
    vehicle_name: thisVehicle.vehicle_name,
    registration_number: thisVehicle.registration_number,
    type: thisVehicle.type,
  };
  return { ...result.rows[0], vehicle };
};

const updateBookingCustomer = async (id: string, status: string) => {
  if (status !== "cancelled") {
    throw new Error("this status is not available");
  }

  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);

  if (!booking.rows.length) {
    throw new Error("booking not found");
  }

  const isRentStarted = new Date(booking.rows[0].rent_start_date) > new Date();

  if (isRentStarted) {
    throw new Error(
      "sorry booking can be cancelled only before start date only"
    );
  }

  const result = await pool.query(
    `Update bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );

  const vehicle = result.rows[0];
  await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
    "available",
    vehicle.vehicle_id,
  ]);
  return { ...result.rows[0], status: "cancelled" };
};

const updateBookingAdmin = async (id: string, status: string) => {
  if (status !== "returned") {
    throw new Error("this status is not available");
  }
  const result = await pool.query(
    `Update bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );

  if (result.rows.length) {
    const thisVehicle = result.rows[0];
    await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`,
      ["available", thisVehicle.vehicle_id]
    );
    const vehicleStatus = (
      await vehicleServices.getVehicle(thisVehicle.vehicle_id)
    ).rows[0].availability_status;
    const vehicle = {
      availability_status: vehicleStatus,
    };
    return { ...result.rows[0], vehicle };
  } else {
    throw new Error("booking not found");
  }
};

export const bookingServices = {
  createBooking,
  getBookings,
  getUserBooking,
  updateBookingCustomer,
  updateBookingAdmin,
};
