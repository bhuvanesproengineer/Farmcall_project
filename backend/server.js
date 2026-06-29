import express from 'express';
import cors from 'cors';
import { getFarmcall } from './services/farmcall.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/api/call-status", (req, res) => {

    console.log("===== TWILIO CALLBACK =====");

    const status = req.body.CallStatus;
    const duration = Number(req.body.CallDuration || 0);

    console.log("Status:", status);
    console.log("Duration:", duration);

    if (status === "completed" && duration > 20) {
        console.log("✅ Farmer listened to the message");
    } else {
        console.log("📩 Send SMS backup");
    }

    res.sendStatus(200);
});

app.get('/farmcall', getFarmcall);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});