import express from "express";
import { loginSuperAdmin, registerSuperAdmin } from "../controllers/superAdminController.js";

const router = express.Router();

router.post("/login", loginSuperAdmin);
router.post("/register", registerSuperAdmin); // Only use ONCE

export default router;
