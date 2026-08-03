import mongoose from "mongoose";
import Automation from "../models/Automation.js";
import Farmer from "../models/Farmer.js";
import CallLog from "../models/CallLog.js";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
}

export async function storeFarmerData(farmerData, username) {
  try {
    const formattedData = {
      ...farmerData,
      farmer_name: farmerData.farmer_name || farmerData.farmerName,
      farmerName: farmerData.farmerName || farmerData.farmer_name,
      phone_number: farmerData.phone_number || farmerData.phoneNumber,
      phoneNumber: farmerData.phoneNumber || farmerData.phone_number,
      ...(username && { username })
    };
    const farmer = await Farmer.create(formattedData);
    return farmer;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getAllFarmers = async (username) => {
  const query = username ? { username } : {};
  return await Farmer.find(query);
};

export async function storeCallLog(
  farmerName,
  phoneNumber,
  callStatus,
  callDuration,
  smsStatus,
  username
) {
  return await CallLog.create({
    farmer_name: farmerName,
    phone_number: phoneNumber,
    call_status: callStatus || "initiated",
    call_duration: typeof callDuration === "number" ? callDuration : 0,
    sms_status: smsStatus || "not_required",
    call_date_time: new Date(),
    ...(username && { username })
  });
}

export async function getCallLogs(username) {
  const query = username ? { username } : {};
  return await CallLog.find(query).sort({ call_date_time: -1, _id: -1 });
}

export async function startAutomation(callTime, username) {
  const filter = username ? { username } : {};
  return await Automation.findOneAndUpdate(
    filter,
    {
      call_time: callTime,
      is_active: true,
      ...(username && { username })
    },
    {
      returnDocument: "after",
      upsert: true
    }
  );
}

export async function deleteFarmer(id, username) {
  const filter = username ? { _id: id, username } : { _id: id };
  return await Farmer.findOneAndDelete(filter);
}

export async function updateFarmer(id, updatedData, username) {
  const filter = username ? { _id: id, username } : { _id: id };
  const formattedData = {
    ...updatedData,
    ...(updatedData.farmer_name || updatedData.farmerName ? {
      farmer_name: updatedData.farmer_name || updatedData.farmerName,
      farmerName: updatedData.farmerName || updatedData.farmer_name
    } : {}),
    ...(updatedData.phone_number || updatedData.phoneNumber ? {
      phone_number: updatedData.phone_number || updatedData.phoneNumber,
      phoneNumber: updatedData.phoneNumber || updatedData.phone_number
    } : {})
  };
  return await Farmer.findOneAndUpdate(
    filter,
    formattedData,
    {
      returnDocument: "after"
    }
  );
}

export async function deleteAllFarmers(username) {
  const query = username ? { username } : {};
  return await Farmer.deleteMany(query);
}

export async function clearCallLogs(username) {
  const query = username ? { username } : {};
  return await CallLog.deleteMany(query);
}

export async function stopAutomation(username) {
  const filter = username ? { username } : {};
  return await Automation.findOneAndUpdate(
    filter,
    {
      is_active: false
    },
    {
      returnDocument: "after"
    }
  );
}

export async function getAutomation(username) {
  const query = username ? { username } : {};
  return await Automation.findOne(query);
}
