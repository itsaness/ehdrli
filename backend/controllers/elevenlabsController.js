import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import {consumeCharacters} from "../services/textService.js";
import {toDarija} from "../services/claudeService.js";
import {Readable} from "stream";
import "dotenv/config";
import pool from "../database/db.js";
//receive voices from elevenlabs api
export async function getVoices(req,res){
   const client = new ElevenLabsClient({apiKey:process.env.ELEVENLABS_API_KEY});
   try{
     let response =  await client.voices.getShared({language:"ar"}); 
      return res.status(200).json(response.voices);
   }catch(err){
    return res.status(500).json({message:err.message});
   }
}
//create speed from elevenlabs api
export async function generateVoice(req,res){
    let {text,voiceId,isLatinDarija} = req.body;
    let userId = req.user.id;
    if(!text){
        return res.status(400).json({message:"text shouldn't be empty"});
    }
    const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });
    try{
        if(isLatinDarija){
            text = await toDarija(text);
        }
        const response = await consumeCharacters(text.length,userId);
       if(!response.ok){
        return res.status(400).json({message:"Not enough characters remaining. Please upgrade your plan !"});

        }
        let result = await client.textToSpeech.convert(voiceId, {
        outputFormat: "mp3_44100_128",
        text: text,
        modelId: "eleven_v3",
    });
    res.setHeader("Content-Type","audio/mpeg");
    Readable.from(result).pipe(res);
       } catch(err){
      await consumeCharacters(-text.length,userId).catch(()=>{});
      return res.status(500).json({message:err.message});
    }
      
      
    
     
   
   
}