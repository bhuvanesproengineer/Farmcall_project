import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema({
  farmer_name: String,
  phone_number: String,
  call_status: String,
  call_duration: Number,
  sms_status: String,

  call_date_time: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model(
  "CallLog",
  callLogSchema
);