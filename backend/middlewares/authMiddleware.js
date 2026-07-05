import {auth} from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const authMiddleware=async (req,res,next)=>{
    try{
        let session = await auth.api.getSession({
        headers:fromNodeHeaders(req.headers)
    }
    );
    if(!session){
        res.status(400).json({message:"unAuthorized !"});
    }
    req.user=session.user;
    req.session=session;
    next(); 
    }catch(err){
        return res.status(500).json({message:err.message});
    }
   
}