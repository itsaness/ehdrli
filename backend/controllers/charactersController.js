import { getCharactersUsage } from "../services/subscriptionService.js";

export const getCharactersController = async (req,res)=>{
    let userId = req.user.id;
    try{
        let usage = await getCharactersUsage(userId);
        return res.status(200).json({usage});
    }catch(err){
        return res.status(500).json({message:err.message});
    }

}