import {generateCheckout} from "../services/chargilyService.js";
import pool from "../database/db.js";



export const checkout = async (req,res)=>{
    let {planId} = req.body;
    let userId = req.user.id;
    if(!planId){
        return res.status(400).json({message:"plan shouldn't be empty."});
    }
    try{
        let {rows:plans}=await pool.query("SELECT price FROM plans WHERE id=$1",[planId]);
        if(plans.length==0){
            return res.status(400).json({message:"Plan price shouldn't be empty."});
        }
        let amount = plans[0].price;
        let chargilyData = await generateCheckout(amount,planId,userId);
        return res.status(200).json({checkoutURL:chargilyData.checkout_url});
    }catch(err){
        res.status(500).json({message:err.message});
    }
}