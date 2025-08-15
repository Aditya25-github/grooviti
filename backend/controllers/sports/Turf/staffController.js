import TurfStaff from "../../../models/sports/Turf/turfStaffModel.js";

// Get all staff for authenticated user
export const getAllStaff = async (req, res) => {
  try {
    const staff = await TurfStaff.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching staff" });
  }
};

// Get staff by ID (only if owned by authenticated user)
export const getStaffById = async (req, res) => {
  try {
    const staff = await TurfStaff.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching staff" });
  }
};

// Create new staff
export const createStaff = async (req, res) => {
  try {
    const staffData = {
      ...req.body,
      createdBy: req.user.id, // Get from authenticated user
    };

    const staff = new TurfStaff(staffData);
    const savedStaff = await staff.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Staff member with this email already exists" });
    }
    res.status(500).json({ message: "Server error while creating staff" });
  }
};

// Update staff (only if owned by authenticated user)
export const updateStaff = async (req, res) => {
  try {
    const staff = await TurfStaff.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Staff member with this email already exists" });
    }
    res.status(500).json({ message: "Server error while updating staff" });
  }
};

// Delete staff (only if owned by authenticated user)
export const deleteStaff = async (req, res) => {
  try {
    const staff = await TurfStaff.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting staff" });
  }
};
