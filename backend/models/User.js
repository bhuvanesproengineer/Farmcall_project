import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }
});

export default mongoose.model("User", userSchema);
