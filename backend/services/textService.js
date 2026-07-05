import pool from "../database/db.js";
//calculate text size and update subscription
export let consumeCharacters = async (amount,userId)=>{
   const client = await pool.connect();
   try{
    await client.query("BEGIN");
    const {rows} = await pool.query(`SELECT s.id,s.characters_used,p.character_limit FROM subscriptions s JOIN plans p ON p.id=s.plan_id
      WHERE s.user_id=$1 AND s.status='active' AND s.current_period_end>CURRENT_TIMESTAMP
      ORDER BY s.current_period_end ASC
      FOR UPDATE
      `,[userId]);
    if(rows.length==0){
      await client.query("ROLLBACK");
      return({ok:false,remaining:0});
    }
    if(amount>0){
     const totalRemaining = rows.reduce((sum,r)=>sum+(r.character_limit-r.characters_used),0);
    if(amount>totalRemaining){
      await client.query("ROLLBACK");
      return({ok:false,remaining:totalRemaining});
   }
   let toConsume=amount;
   for(const sub of rows){
      if(toConsume<=0) break;
      const available = sub.character_limit-sub.characters_used;
      const take = Math.min(available,toConsume);
      if(take>0){
         await client.query("UPDATE subscriptions SET characters_used=characters_used+$1 WHERE id=$2",[take,sub.id]);
         toConsume-=take;

      }
      
    }
    await client.query("COMMIT");
   return({ok:true,remaining:totalRemaining-amount});
   
   }else{
      let toRefund=-amount;
      for(const sub of rows){
         if(toRefund<=0)break;
         const refundable = Math.min(sub.characters_used,toRefund);
         if(refundable>0){
            await client.query(`UPDATE subscriptions SET characters_used=characters_used-$1 WHERE id=$2`,[refundable,sub.id]);
            toRefund-=refundable;
         }
      }
      await client.query("COMMIT");
      return {ok:true};
      
    }
   }catch(err){
    await client.query("ROLLBACK");
    throw err;
   }finally{
      client.release();
   }

}