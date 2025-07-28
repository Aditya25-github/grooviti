import express from "express";
import {
  loginAcademyOwner,
  registerAcademyOwner,
} from "../../controllers/Academy/academyController.js";

const router = express.Router();

router.post("/login", loginAcademyOwner);
router.post("/register", registerAcademyOwner);

export default router;
