import {getPlans} from "../services/planService.js";

export let getPlansController = async (req,res)=>{
    try{
        let plans = await getPlans();
        return res.status(200).json(plans);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}