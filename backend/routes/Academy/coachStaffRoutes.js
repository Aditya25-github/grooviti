import express from "express";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffById,
  toggleStaffStatus,
  assignBatch,
  removeBatch
} from "../../controllers/Academy/coachStaffController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Main CRUD routes
router.route("/")
  .get(getAllStaff)
  .post(createStaff);

router.route("/:id")
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

// Additional functionality routes
router.patch("/:id/toggle-status", toggleStaffStatus);
router.patch("/:id/assign-batch", assignBatch);
router.patch("/:id/remove-batch", removeBatch);

export default router;
