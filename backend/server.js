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
    console.log(req.body);

    console.log("Call SID:", req.body.CallSid);
    console.log("Status:", req.body.CallStatus);
    console.log("Duration:", req.body.CallDuration);

    res.sendStatus(200);
});

app.get('/farmcall', getFarmcall);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});