import { verifySignature } from "../services/chargilyService.js";
import { fullfillSubscription } from "../services/subscriptionService.js";

export const webhook = async (req,res)=>{
    const signature = req.get("signature");
    const payload = req.body;
    if(!signature){
        return res.sendStatus(400);
    }
    if(!verifySignature(payload,signature)){
        return res.sendStatus(400);
    }
    const event = JSON.parse(payload.toString("utf-8"));
    if(event.type!=="checkout.paid"){
        return res.status(200).json({message:"ignored"});
    }
    try{
       let userId=event.data.metadata.userId;
    let planId=event.data.metadata.planId;
    let checkoutId=event.data.id;
    await fullfillSubscription(planId,userId,checkoutId);
    res.status(200).json({message:"webhook received and processed"}); 
    }catch(err){
        res.status(500).json({message:err.message});
    }
    

}