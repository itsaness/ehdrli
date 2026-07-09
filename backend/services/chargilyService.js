import "dotenv/config";
import crypto from "crypto";
export const verifySignature = (payload,signature)=>{
    try{
      const computedSignature = crypto.createHmac("sha256",process.env.CHARGILY_API_KEY).update(payload).digest("hex");
    return computedSignature === signature;  
    }catch(err){
        return false;
    }
    
}
export const generateCheckout = async (amount,planId,userId)=>{
    const options = {
  method: 'POST',
  headers: {Authorization: `Bearer ${process.env.CHARGILY_API_KEY}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({
    amount: amount,
    currency: 'dzd',
    success_url: 'https://ehdrli.com/text-to-speech',
    failure_url:'https://ehdrli.com/pricing',
    metadata:
        {
           userId,
           planId 
        }
    
  })
};
try{
    let result = await fetch('https://pay.chargily.net/api/v2/checkouts', options);
    let data = await result.json();
    if(!result.ok){
        throw new Error(data.message||"Failed to create chargily checkout");
    }
    return data;
}catch(err){
    throw err;
}

}