import mongoose from "mongoose";
import ticketModel from "./models/ticketModel.js";

async function run() {
  await mongoose.connect('mongodb+srv://adityadivate25:0101196625@cluster0.eyk0n.mongodb.net/GROOVITI');
  const event = await ticketModel.findOne().sort({ createdAt: -1 });
  console.log(event);
  mongoose.disconnect();
}
run();
