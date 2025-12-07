import { pool } from "../../config/db";
import sendJson from "../../helper/sendJson";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result;
};

const updateUser = async (
  id: string,
  payload: { name?: string; email?: string; phone?: string;role?: string},
  isAdmin : boolean
) => {

  if(!isAdmin){
    delete payload.role
  }

  const keys = Object.keys(payload);
  const values = Object.values(payload);

  if (keys.length === 0) {
    throw new Error("No fields to update");
  }

  const setQueries = keys
    .map((key, index) => `${key}=$${index + 1}` )
    .join(", ");
  

  const result = await pool.query(
    `UPDATE users SET ${setQueries} WHERE id=$${keys.length + 1} RETURNING id,name,email,phone,role`,
    [...values, id]
  );
  return result;
};

const deleteUser = async (id:string) => {
    const hasAnyBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`,[id]);
    if(hasAnyBookings.rows.length){
      throw new Error("user have ongoing booking cannot be deleted"); 
    }
    const result = await pool.query(`DELETE FROM users WHERE id=$1`,[id]);
    return result;
}

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser
};
