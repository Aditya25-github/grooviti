import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  batch: { type: String, required: true },
  coach: { type: String, required: true },
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademyStudents",
        required: true,
      },
      isPresent: { type: Boolean, required: true },
    },
  ],
  academyOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademyOwner",
    required: true,
  },
});

export default mongoose.model("AttendanceRecord", attendanceSchema);
