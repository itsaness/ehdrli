import pool from "../database/db.js";

export let getPlans = async()=>{
    try{
        let {rows}=await pool.query("SELECT id,name,character_limit,price FROM plans ORDER BY id ASC");
        return rows;
           
    }catch(err){
        throw err;
    }
}