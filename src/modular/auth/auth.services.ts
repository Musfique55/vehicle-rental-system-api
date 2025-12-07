import bcrypt from "bcryptjs";
import { pool } from "../../config/db"
import jwt from "jsonwebtoken"
import { config } from "../../config";

const createUser = async (payload : Record<string,unknown>) => {
    const {name,email,password,phone,role} = payload;

    const hashedPass = await bcrypt.hash(password as string,10);


    const result = await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id ,name ,email ,phone ,role`,[name,email,hashedPass,phone,role]);

    return result;
}

const loginUser = async (payload : Record<string,unknown>) => {
    const {email,password} = payload;
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);

    if(!result.rowCount){
        throw new Error("user not found");
    }

    const user = result.rows[0];

    const matched = bcrypt.compare(password as string,user.password);

    if(!matched){
        throw new Error("invalid credentials");
    }

    delete user.password;

    const token = jwt.sign({name:user.name,email : user.email,role:user.role,id:user.id},config.jwt_secret as string,{expiresIn : "10h"});

    return {token,user};

}

export const authServices = {
    createUser,
    loginUser
}