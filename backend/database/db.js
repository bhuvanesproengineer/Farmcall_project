
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


       


export async function storeFarmerData(farmerData) {
  try {
    const farmer = await Farmer.create(farmerData);

    return farmer;
  } catch (error) {
    throw new Error(error.message);
  }
}


export const getAllFarmers = async () => {
  return await Farmer.find();
};
     

export async function storeCallLog(
  farmerName,
  phoneNumber,
  callStatus,
  callDuration,
  smsStatus
) {
  return await CallLog.create({
    farmer_name: farmerName,
    phone_number: phoneNumber,
    call_status: callStatus,
    call_duration: callDuration,
    sms_status: smsStatus
  });
}
 

export async function getCallLogs() {
  return await CallLog.find()
    .sort({ createdAt: -1 });
}
    
       

export async function startAutomation(callTime) {
  return await Automation.findOneAndUpdate(
    {},
    {
      call_time: callTime,
      is_active: true
    },
    {
      new: true,
      upsert: true
    }
  );
}
  

export async function stopAutomation() {
  return await Automation.findOneAndUpdate(
    {},
    {
      is_active: false
    },
    {
      new: true
    }
  );
}
   

export async function getAutomation() {
  return await Automation.findOne();
}
