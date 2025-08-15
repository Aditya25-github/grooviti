import mongoose from "mongoose";

const coachStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    enum: ["Junior", "Mid-Level", "Senior"],
    required: true
  },
  joined: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  batches: [{
    type: String
  }],
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  academyOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Generate unique staff ID
coachStaffSchema.virtual('staffId').get(function () {
  const prefix = this.role.includes('Coach') ? 'COA' : 'SUP';
  const idNum = this._id.toString().slice(-3).padStart(3, '0');
  return `${prefix}${idNum}`;
});

coachStaffSchema.set('toJSON', { virtuals: true });

const CoachStaff = mongoose.model("CoachStaff", coachStaffSchema);
export default CoachStaff;
