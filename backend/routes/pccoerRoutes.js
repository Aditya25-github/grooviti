import express from "express";
import { getPccoerEvents, getPccoerCommunities } from "../controllers/pccoerController.js";

const router = express.Router();

router.get("/events", getPccoerEvents);
router.get("/communities", getPccoerCommunities);

export default router;
