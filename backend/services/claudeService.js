import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config"
export const toDarija = async (text)=>{
    const client = new Anthropic({
        apiKey:process.env.CLAUDE_API_KEY
    });
    try{
       const message = await client.messages.create({
        max_tokens:2048,
        system:`You are an expert in Algerian Darija. The user will give you Algerian Darija text written in Latin script (Franco-Arabic), Arabic script, or a mix of both, possibly containing French words.
Your job is to convert it into Arabic script while:
- Keeping it as Darija (do NOT translate to MSA/فصحى)
- Preserving French loanwords but write them phonetically in Arabic script (e.g. "la voiture" → "لا فواتير", "normal" → "نورمال")
- Numbers used as letters: 3=ع, 7=ح, 9=ق, 2=ء, 8=غ (e.g. "3lash" → "علاش", "9ahwa" → "قهوة")
- Return ONLY the Arabic script text, nothing else
Text:`,
        messages:[{content:text,role:"user"}],
       model:"claude-haiku-4-5"
    }) 
    return message.content[0].text;
    }catch(err){
        throw err;
    }
    
}