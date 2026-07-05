import express from "express";
import {getVoices,generateVoice} from "../controllers/elevenlabsController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/",getVoices);
router.post("/",authMiddleware,generateVoice);

export default router;