import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {getCharactersController} from "../controllers/charactersController.js";
let router = express.Router();

router.get("/",authMiddleware,getCharactersController);

export default router;
    
    