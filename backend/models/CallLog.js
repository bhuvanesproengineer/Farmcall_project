import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema({
  farmer_name: String,
  phone_number: String,
  call_status: String,
  call_duration: Number,
  sms_status: String
}, {
  timestamps: true
});

export default mongoose.model(
  "CallLog",
  callLogSchema
);