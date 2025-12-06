import { Response } from "express";

const sendJson = (res: Response, message: string, status_code: number,success:boolean,data : any = null) => {
  if(!data){
    return res.status(status_code).json({
        success,
        message,
      })
  } else{
      return res.status(status_code).json({
        success,
        message,
        data
      })
  } 
};

export default sendJson;
