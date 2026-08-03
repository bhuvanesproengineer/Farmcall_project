import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  username: { type: String, index: true },
  village: String,
  mandal: String,
  district: String,
  pincode: String,
  state: String,
  language: String,
  farmer_name: String,
  phone_number: String,
  farmerName: String,
  phoneNumber: String
});

export default mongoose.model("Farmer", farmerSchema);