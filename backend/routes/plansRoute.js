import express from "express";
import {getPlansController} from "../controllers/plansController.js";
let router = express.Router();

router.get("/",getPlansController);

export default router;