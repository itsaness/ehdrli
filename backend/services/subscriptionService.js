import pool from "../database/db.js";
export const getCharactersUsage = async(userId)=>{
    try{
        const {rows} = await pool.query(`SELECT p.character_limit,s.characters_used,s.current_period_end FROM subscriptions s
            JOIN plans p ON p.id=s.plan_id
            WHERE s.user_id=$1 AND s.status='active' AND s.current_period_end>CURRENT_TIMESTAMP
            ORDER BY current_period_end ASC `,[userId]);
        const totalLimit = rows.reduce((sum,r)=>sum+r.character_limit,0);
        const totalUsed = rows.reduce((sum,r)=>sum+r.characters_used,0);
        const totalRemaining = totalLimit-totalUsed;

        return{
            used:totalUsed,
            limit:totalLimit,
            remaining:totalRemaining,
        }
    }catch(err){
        throw err;
    }

}
export const fullfillSubscription = async(stringPlanId,userId,checkoutId)=>{
    let planId = Number(stringPlanId);
    if(isNaN(planId)){
        throw new Error("invalid plan id");
    }
    try{
      await pool.query(`INSERT INTO subscriptions (user_id,plan_id,status,characters_used,current_period_end,checkout_id) VALUES ($1,$2,'active',0,CURRENT_TIMESTAMP+INTERVAL '1 month',$3) ON CONFLICT (checkout_id) DO NOTHING`,[userId,planId,checkoutId]);
    }catch(err){
        throw err;
    }
}