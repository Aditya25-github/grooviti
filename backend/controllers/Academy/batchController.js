// backend/controllers/Academy/batchController.js
import asyncHandler from "express-async-handler";
import AcademyBatch from "../../models/Academy/academyBatchModel.js";

// @desc    Get all batches for logged-in academy owner
// @route   GET /api/batches
// @access  Private
export const getBatches = asyncHandler(async (req, res) => {
  const ownerId = req.user.id || req.user._id;
  const batches = await AcademyBatch.find({ academyOwner: ownerId }).sort({ createdAt: -1 });
  res.json(batches);
});

// @desc    Create new batch
// @route   POST /api/batches
// @access  Private
export const createBatch = asyncHandler(async (req, res) => {
  const { sport, name, coach, days, time, students, status } = req.body;

  if (!sport || !name || !coach || !days || !time) {
    res.status(400);
    throw new Error("Missing required fields: sport, name, coach, days, and time are required");
  }

  // Check if batch name already exists for this owner
  const existingBatch = await AcademyBatch.findOne({
    name,
    academyOwner: req.user.id || req.user._id
  });

  if (existingBatch) {
    res.status(400);
    throw new Error("Batch name already exists");
  }

  const newBatch = new AcademyBatch({
    sport,
    name,
    coach,
    days,
    time,
    students: students || 0,
    status: status || "Active",
    academyOwner: req.user.id || req.user._id,
  });

  const created = await newBatch.save();
  res.status(201).json(created);
});

// @desc    Edit batch
// @route   PUT /api/batches/:id
// @access  Private
export const updateBatch = asyncHandler(async (req, res) => {
  const batch = await AcademyBatch.findById(req.params.id);

  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }

  // Check ownership
  if (batch.academyOwner.toString() !== (req.user.id || req.user._id).toString()) {
    res.status(403);
    throw new Error("Not authorized to update this batch");
  }

  const updates = req.body;
  Object.assign(batch, updates);

  const updated = await batch.save();
  res.json(updated);
});

// @desc    Delete batch
// @route   DELETE /api/batches/:id
// @access  Private
export const deleteBatch = asyncHandler(async (req, res) => {
  const batch = await AcademyBatch.findById(req.params.id);

  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }

  // Check ownership
  if (batch.academyOwner.toString() !== (req.user.id || req.user._id).toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this batch");
  }

  await AcademyBatch.findByIdAndDelete(req.params.id);
  res.json({ message: "Batch deleted successfully" });
});

// @desc    Get single batch
// @route   GET /api/batches/:id
// @access  Private
export const getBatch = asyncHandler(async (req, res) => {
  const batch = await AcademyBatch.findById(req.params.id);

  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }

  // Check ownership
  if (batch.academyOwner.toString() !== (req.user.id || req.user._id).toString()) {
    res.status(403);
    throw new Error("Not authorized to view this batch");
  }

  res.json(batch);
});
