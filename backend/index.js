import express from "express";
import cors from "cors";
import voicesRoute from "./routes/voicesRoute.js";
import chargilyRoute from "./routes/chargilyRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import charactersRoute from "./routes/charactersRoute.js";
import plansRoute from "./routes/plansRoute.js";
import { toNodeHandler } from "better-auth/node";
import {auth} from "./auth.js";
const originOptions = {
    origin:['http://localhost:5173',"https://dzoin.com" ],
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true
}
let app = express();
let port = 3000;
app.use(cors(originOptions));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/payment",paymentRoute);
app.use(express.json());
app.use("/api/plans",plansRoute);
app.use("/api/voices",voicesRoute);
app.use("/api/checkout",chargilyRoute);
app.use("/api/characters",charactersRoute);
app.listen(port,()=>{
    console.log("server is running !");
})