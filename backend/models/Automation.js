import mongoose from "mongoose";

const automationSchema = new mongoose.Schema({
  username: { type: String, index: true },
  call_time: String,
  is_active: Boolean,
  last_call_date: String
});

export default mongoose.model("Automation", automationSchema);