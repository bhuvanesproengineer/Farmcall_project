import express from 'express';
import cors from 'cors';
import { getFarmcall } from './services/farmcall.js';
import dotenv from 'dotenv';
import { backupMsg } from "./services/backupMsg.js";
import { callStore } from "./services/makeCall.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/call-status", async (req, res) => {

    const status = req.body.CallStatus;
    const duration = Number(req.body.CallDuration || 0);
    const callSid = req.body.CallSid;
 console.log("Status:", status);
    console.log("Duration:", duration);
    console.log("Call SID:", callSid);
    const callData = callStore[callSid];

    if (callData) {

        await backupMsg(
            status,
            duration,
            callData.phoneNumber,
            callData.farmerSummary
        );
    }

    res.sendStatus(200);
});

app.get('/farmcall', getFarmcall);
app.get("/test", (req, res) => {
    res.send("BACKEND_WORKING");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
