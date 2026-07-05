import pool from "../database/db.js";

export let getPlans = async()=>{
    try{
        let {rows}=await pool.query("SELECT id,name,character_limit,price FROM plans");
        return rows;
           
    }catch(err){
        throw err;
    }
}