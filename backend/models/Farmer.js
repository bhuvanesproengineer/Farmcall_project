import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  village: String,
  mandal: String,
  district: String,
  pincode: String,
  state: String,
  language: String,
  farmer_name: String,
  phone_number: String
});

export default mongoose.model(
  "Farmer",
  farmerSchema
);