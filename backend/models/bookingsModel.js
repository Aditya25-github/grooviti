import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  orderId: { type: String, unique: true },
  status: { type: String, default: "Booked" },
  attendance: { type: Boolean, default: false },
  certificateSent: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentId: { type: String },
  emailSent: { type: Boolean, default: false },
  emailDelivered: { type: Boolean, default: false },
  emailOpened: { type: Boolean, default: false },
  whatsappClicked: { type: Boolean, default: false },
})

const bookingModel = mongoose.models.booking || mongoose.model("bookings", bookingSchema)

export default bookingModel;