import express from "express";
import { handleBrevoWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/brevo", handleBrevoWebhook);

export default router;
