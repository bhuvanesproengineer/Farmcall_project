import express from 'express';
import cors from 'cors';
import { getFarmcall } from './services/farmcall.js';
import dotenv from 'dotenv';
import { backupMsg } from "./services/backupMsg.js";
import { callStore } from "./services/makeCall.js";
import {  storeCallLog,  getCallLogs } from "./database/db.js";
import { storeFarmerData } from "./database/db.js";
import { getAllFarmers } from "./database/db.js";


dotenv.config();

const app = express();
    
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post("/call-all-farmers", async (req, res) => {

    const farmers = await getAllFarmers();

    startCallingQueue(farmers);

    res.status(200).json({
        message: "Calling process started"
    });

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
