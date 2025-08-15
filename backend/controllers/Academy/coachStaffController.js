import asyncHandler from "express-async-handler";
import CoachStaff from "../../models/Academy/coachStaffModel.js";

// @desc Get all staff for logged-in academy owner
// @route GET /api/coach-staff
// @access Private
export const getAllStaff = asyncHandler(async (req, res) => {
  const ownerId = req.user._id || req.user.id;
  const staff = await CoachStaff.find({ academyOwner: ownerId }).sort({ createdAt: -1 });
  res.json(staff);
});

// @desc Create new staff member
// @route POST /api/coach-staff
// @access Private
export const createStaff = asyncHandler(async (req, res) => {
  const { name, avatar, role, sport, experience, joined, salary, batches, status } = req.body;

  // Validation
  if (!name || !role || !sport || !experience || !joined || salary === undefined) {
    res.status(400);
    throw new Error("Please provide all required fields: name, role, sport, experience, joined date, and salary");
  }

  // Check for duplicate staff name for this academy
  const existingStaff = await CoachStaff.findOne({
    name,
    academyOwner: req.user._id || req.user.id
  });

  if (existingStaff) {
    res.status(400);
    throw new Error("Staff member with this name already exists");
  }

  const newStaff = new CoachStaff({
    name,
    avatar: avatar || "",
    role,
    sport,
    experience,
    joined: new Date(joined),
    salary: Number(salary),
    batches: batches || [],
    status: status || "Active",
    academyOwner: req.user._id || req.user.id
  });

  const createdStaff = await newStaff.save();
  res.status(201).json(createdStaff);
});

// @desc Update staff member
// @route PUT /api/coach-staff/:id
// @access Private
export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await CoachStaff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  // Check ownership
  if (staff.academyOwner.toString() !== (req.user._id || req.user.id).toString()) {
    res.status(403);
    throw new Error("Not authorized to update this staff member");
  }

  // If updating joined date, convert to Date object
  if (req.body.joined) {
    req.body.joined = new Date(req.body.joined);
  }

  // If updating salary, convert to Number
  if (req.body.salary !== undefined) {
    req.body.salary = Number(req.body.salary);
  }

  const updates = req.body;
  Object.assign(staff, updates);

  const updatedStaff = await staff.save();
  res.json(updatedStaff);
});

// @desc Delete staff member
// @route DELETE /api/coach-staff/:id
// @access Private
export const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await CoachStaff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  // Check ownership
  if (staff.academyOwner.toString() !== (req.user._id || req.user.id).toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this staff member");
  }

  await CoachStaff.findByIdAndDelete(req.params.id);
  res.json({ message: "Staff member removed successfully" });
});

// @desc Get single staff member details
// @route GET /api/coach-staff/:id
// @access Private
export const getStaffById = asyncHandler(async (req, res) => {
  const staff = await CoachStaff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  // Check ownership
  if (staff.academyOwner.toString() !== (req.user._id || req.user.id).toString()) {
    res.status(403);
    throw new Error("Not authorized to view this staff member");
  }

  res.json(staff);
});

// @desc Toggle staff status (Active/Inactive)
// @route PATCH /api/coach-staff/:id/toggle-status
// @access Private
export const toggleStaffStatus = asyncHandler(async (req, res) => {
  const staff = await CoachStaff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  // Check ownership
  if (staff.academyOwner.toString() !== (req.user._id || req.user.id).toString()) {
    res.status(403);
    throw new Error("Not authorized to update this staff member");
  }

  staff.status = staff.status === "Active" ? "Inactive" : "Active";
  const updatedStaff = await staff.save();

  res.json(updatedStaff);
});

// @desc Assign batch to staff
// @route PATCH /api/coach-staff/:id/assign-batch
// @access Private
export const assignBatch = asyncHandler(async (req, res) => {
  const staff = await CoachStaff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  // Check ownership
  if (staff.academyOwner.toString() !== (req.user._id || req.user.id).toString()) {
    res.status(403);
    throw new Error("Not authorized to update this staff member");
  }

  const { batch } = req.body;

  if (!batch) {
    res.status(400);
    throw new Error("Batch name is required");
  }

  // Check if batch is already assigned
  if (!staff.batches.includes(batch)) {
    staff.batches.push(batch);
    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } else {
    res.status(400);
    throw new Error("Batch is already assigned to this staff member");
  }
});

// @desc Remove batch from staff
// @route PATCH /api/coach-staff/:id/remove-batch
// @access Private
export const removeBatch = asyncHandler(async (req, res) => {
  const staff = await CoachStaff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }

  // Check ownership
  if (staff.academyOwner.toString() !== (req.user._id || req.user.id).toString()) {
    res.status(403);
    throw new Error("Not authorized to update this staff member");
  }

  const { batch } = req.body;

  if (!batch) {
    res.status(400);
    throw new Error("Batch name is required");
  }

  staff.batches = staff.batches.filter(b => b !== batch);
  const updatedStaff = await staff.save();
  res.json(updatedStaff);
});
