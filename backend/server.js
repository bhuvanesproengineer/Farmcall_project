import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cron from "node-cron";
import axios from "axios";

import { getFarmcall } from "./services/farmcall.js";
import { backupMsg } from "./services/backupMsg.js";
import { callStore } from "./services/makeCall.js";
import { callAllFarmers } from "./services/callAllFarmers.js";

import connectDB, {
  storeCallLog,
  getCallLogs,
  storeFarmerData,
  getAllFarmers,
  startAutomation,
  stopAutomation,
  getAutomation,deleteFarmer,updateFarmer,deleteAllFarmers,clearCallLogs
} from "./database/db.js";

dotenv.config();
await connectDB();

const app = express();
    
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post("/call-all-farmers", async (req, res) => {

    const farmers = await getAllFarmers();
    console.log(farmers);

    await callAllFarmers(farmers);

    res.status(200).json({
        message: "Calling process started"
    });

});
app.delete("/delete-farmer/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await deleteFarmer(id);

        res.status(200).json({
            message: "Farmer deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting farmer:", error);

        res.status(500).json({
            message: "Error deleting farmer"
        });
    }
});
app.delete("/delete-all-farmers", async (req, res) => {
    try {

        const result = await deleteAllFarmers();

        res.status(200).json({
            success: true,
            message: "All farmers deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete all farmers"
        });

    }
});
app.delete("/clear-call-logs", async (req, res) => {
    try {

        const result = await clearCallLogs();

        res.status(200).json({
            success: true,
            message: "Call logs cleared successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to clear call logs"
        });

    }
});
app.put("/update-farmer/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedFarmer = await updateFarmer(id, updatedData);

        if (!updatedFarmer) {
            return res.status(404).json({
                message: "Farmer not found"
            });
        }

        res.status(200).json({
            message: "Farmer updated successfully",
            data: updatedFarmer
        });

    } catch (error) {
        console.error("Error updating farmer:", error);

        res.status(500).json({
            message: "Error updating farmer"
        });
    }
});


cron.schedule("* * * * *", async () => {

    try {
        console.log("Cron running...");

        const automation = await getAutomation();

        if (!automation || !automation.is_active) {
            return;
        }

        const currentTime = new Date().toLocaleTimeString(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );

        if (currentTime === automation.call_time) {

            const farmers = await getAllFarmers();
            await callAllFarmers(farmers);

        }

    } catch (error) {

        console.error(error);

    }

});

console.log("Automation Scheduler Started");


app.post("/start-automation", async (req, res) => {

    try {

        const { callTime } = req.body;

        await startAutomation(callTime);

        res.status(200).json({
            success: true,
            message: "Automation started",
            callTime
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to start automation"
        });

    }

});
app.get("/automation-status", async (req, res) => {

    try {

        const automation = await getAutomation();

        res.status(200).json({
            success: true,
            data: automation
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch automation status"
        });

    }

});
app.post("/stop-automation", async (req, res) => {

    try {

        await stopAutomation();

        res.status(200).json({
            success: true,
            message: "Automation stopped"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to stop automation"
        });

    }

});
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
app.post("/register_farmer", async (req, res) => {
    
    storeFarmerData(req.body)
        .then(() => {
            res.status(200).json({ message: "Farmer data stored successfully" });
        })
        .catch((error) => {
            console.error("Error storing farmer data:", error);
            res.status(500).json({ message: "Error storing farmer data" });
        });

})

app.get("/get-all-farmers", async (req, res) => {

    try {

        const farmers = await getAllFarmers();

        res.json({
            success: true,
            data: farmers
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}); 
app.post("/api/call-status", async (req, res) => {

    try {

        const status = req.body.CallStatus;
        const duration = Number(req.body.CallDuration || 0);
        const callSid = req.body.CallSid;

        const callData = callStore[callSid];

        if (!callData) {
            console.log("Call data not found for SID:", callSid);
            return res.sendStatus(200);
        }

        let smsStatus = "failed";

        try {

         smsStatus = await backupMsg(
    status,
    duration,
    callData.phoneNumber,
    callData.farmerSummary,
    callData.language
);



        

        } catch (error) {

            
            smsStatus = "failed";
        }

        await storeCallLog(
            callData.farmerName,
            callData.phoneNumber,
            status,
            duration,
            smsStatus
        );

        delete callStore[callSid];

        res.sendStatus(200);

    } catch (error) {

        console.error("Callback Error:", error);
        res.sendStatus(500);
    }

});
app.get("/api/call-logs", async (req, res) => {

    try {

        const logs = await getCallLogs();

        res.json({
            success: true,
            data: logs
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }

});
app.get('/farmcall', getFarmcall);
app.get("/test", (req, res) => {
    res.send("BACKEND_WORKING");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
