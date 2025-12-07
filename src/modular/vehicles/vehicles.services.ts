import { pool } from "../../config/db";

interface Payload {
  vehicle_name?: string;
  type?: string;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: string;
}

const createVehicles = async (
  vehicle_name: string,
  type: "car" | "bike" | "van" | "SUV",
  registration_number: string,
  daily_rent_price: number,
  availability_status: "available" | "booked"
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getVehicle = async (id: string) => {
  const result = pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicle = async (id: string, payload: Payload) => {
  const keys = Object.keys(payload);
  const values = Object.values(payload);

  if (keys.length === 0) {
    throw new Error("no vehicle found to update");
  }

  const setQueries = keys.map((key, idx) => `${key}=$${idx + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE vehicles SET ${setQueries} WHERE id=$${
      keys.length + 1
    } RETURNING *`,
    [...values, id]
  );

  return result;
};

const deleteVehicle = async (id: string) => {
  const hasAnyBookings = await pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1`,[id]);
    if(hasAnyBookings.rows.length){
      throw new Error("vehicle is on rent cannot be deleted"); 
    }
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`,[id]);
  return result;
};

export const vehicleServices = {
  createVehicles,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
};
