import { betterAuth } from "better-auth";
import {Resend} from 'resend';
import pool from "./database/db.js"
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);


 export const auth = betterAuth({
  trustedOrigins:["http://localhost:3000","http://localhost:5173","https://api.dzoin.com","https://dzoin.com"],
  secret:process.env.BETTER_AUTH_SECRET,
  baseURL:process.env.BETTER_AUTH_URL,
  emailAndPassword: { 
    enabled: true, 
    sendResetPassword:async({user,url,token},request)=>{
    try{
      const {data,error}=await resend.emails.send({
        from:"Dzoin Security <support@dzoin.com>",
        to:user.email,
        subject:"Reset your password",
        html:`<p>Click the button below to finalize your password change for Dzoin</p>
              <a href="${url}">Click here</a>   
        `
      })
      if(error){
        console.error(error.message);
        throw new Error(error.message);
      }
      
    }catch(err){
      console.error(err.message);
      throw err;
    }
    

  }
  },
  emailVerification:{
    sendVerificationEmail:async({user,url,token},request)=>{
      try{
        const {data,error}=await resend.emails.send({
        from:"Dzoin Security <support@dzoin.com>",
        to:user.email,
        subject:"Verify your email",
        html:`<p>Click the button bellow to verify your email for Dzoin</p>
              <a href="${url}">Click here</a>   
        `
      })
      if(error){
        console.error(error.message);
        throw new Error(error.message);
      }
      }catch(err){
        console.error(err.message);
        throw err;
      }
      
    }
  },
  socialProviders:{
    google:{
      clientId:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
    }
  },
  database:pool,
  type:"postgres",
});

