// backend/routes/Academy/batchRoutes.js
import express from "express";
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatch,
} from "../../controllers/Academy/batchController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getBatches)
  .post(authMiddleware, createBatch);

router
  .route("/:id")
  .get(authMiddleware, getBatch)
  .put(authMiddleware, updateBatch)
  .delete(authMiddleware, deleteBatch);

export default router;
