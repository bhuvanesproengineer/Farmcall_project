import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import nodemailer from "nodemailer";

import { callAllFarmers } from "./services/callAllFarmers.js";
import connectDB, {
  getAllFarmers,
  getAutomation
} from "./database/db.js";

import authRoutes from "./routes/authRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import automationRoutes from "./routes/automationRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import broadcastRoutes from "./routes/broadcastRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

import User from "./models/User.js";
import ContactMessage from "./models/ContactMessage.js";
import { authenticateToken } from "./middleware/authenticate.js";

dotenv.config();
await connectDB();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", authRoutes);
app.use("/api/auth", authRoutes);

app.post("/api/contact", async (request, response) => {
  try {
    const { name, email, subject, message } = request.body;
    if (!name || !email || !subject || !message) {
      return response.status(400).json({ error: "All fields are required" });
    }

    // 1. Save to Database
    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    // 2. Send email via Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER || "bhuvanes.proengineer@gmail.com", // Gmail SMTP requires authenticated sender email
      to: "bhuvanes.proengineer@gmail.com", // To receiver (admin)
      replyTo: email, // Set Reply-To to user's actual email
      subject: `[FarmCall Contact Form] ${subject}`,
      text: `New contact form submission from:\nName: ${name}\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    // If EMAIL_PASS and EMAIL_USER are set in env, attempt sending the email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const emailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await emailTransporter.sendMail(mailOptions);
      console.log(`✉️ Email sent successfully from ${email} to bhuvanes.proengineer@gmail.com`);
    } else {
      console.log(`⚠️ Email sending skipped (EMAIL_USER / EMAIL_PASS not set in .env)`);
      console.log(`✉️ Email Mock (From: ${email} -> To: bhuvanes.proengineer@gmail.com)\nSubject: ${mailOptions.subject}\nText: ${mailOptions.text}`);
    }

    return response.status(200).json({ message: "Message Sent Successfully!" });
  } catch (error) {
    console.error("Error processing contact message:", error);
    return response.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/profile/", authenticateToken, async (request, response) => {
  let { username } = request;
  const userDetails = await User.findOne({ username });
  response.send(userDetails);
});

// Public Webhook Endpoint for Twilio Call Status Callbacks (Unauthenticated)
app.post(["/api/call-status", "/calls/status"], async (req, res) => {
  try {
    const params = { ...(req.query || {}), ...(req.body || {}), ...(req.body ? {} : req) };
    const status = params.CallStatus || "completed";
    const duration = Number(params.CallDuration || 0);
    const callSid = params.CallSid;

    const { callStore } = await import("./services/makeCall.js");
    const { storeCallLog } = await import("./database/db.js");
    const { backupMsg } = await import("./services/backupMsg.js");

    const callData = callStore[callSid];

    if (!callData) {
      console.log("Call status callback received for SID:", callSid, "| Status:", status);
      return res.sendStatus(200);
    }

    let smsStatus = "failed";
    try {
      smsStatus = await backupMsg(
        status,
        duration,
        callData.phoneNumber,
        callData.farmerSummary,
        callData.language,
        callData.callType
      );
    } catch (error) {
      smsStatus = "failed";
    }

    if (callData.logId) {
      try {
        const CallLog = (await import("./models/CallLog.js")).default;
        await CallLog.findByIdAndUpdate(callData.logId, {
          call_status: status,
          call_duration: duration,
          sms_status: smsStatus
        });
      } catch (err) {
        console.error("Error updating CallLog by ID:", err.message);
      }
    } else {
      await storeCallLog(
        callData.farmerName,
        callData.phoneNumber,
        status,
        duration,
        smsStatus,
        callData.username
      );
    }

    delete callStore[callSid];
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Status Error:", error);
    res.sendStatus(500);
  }
});

app.use("/farmers", authenticateToken, farmerRoutes);
app.use("/automation", authenticateToken, automationRoutes);
app.use("/calls", authenticateToken, callRoutes);
app.use("/api/call-logs", authenticateToken, (req, res, next) => {
  req.url = "/logs";
  return callRoutes(req, res, next);
});
app.use("/broadcast", authenticateToken, broadcastRoutes);
app.use("/farmcall", authenticateToken, aiRoutes);
app.use("/", healthRoutes);

import Automation from "./models/Automation.js";

function normalizeTime(timeStr) {
  if (!timeStr) return "";
  let str = String(timeStr).trim().toLowerCase();

  const isPm = str.includes("pm");
  const isAm = str.includes("am");
  str = str.replace(/[^\d:]/g, "");

  let [h, m] = str.split(":");
  let hours = parseInt(h || "0", 10);
  let minutes = parseInt(m || "0", 10);

  if (isPm && hours < 12) hours += 12;
  if (isAm && hours === 12) hours = 0;

  const formattedH = String(hours % 24).padStart(2, "0");
  const formattedM = String(minutes).padStart(2, "0");
  return `${formattedH}:${formattedM}`;
}

cron.schedule("* * * * *", async () => {
  try {
    const activeAutomations = await Automation.find({ is_active: true });

    if (!activeAutomations || activeAutomations.length === 0) {
      return;
    }

    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const rawHour = parts.find(p => p.type === "hour")?.value || "0";
    const rawMinute = parts.find(p => p.type === "minute")?.value || "0";
    const currentFormatted = `${rawHour.padStart(2, "0")}:${rawMinute.padStart(2, "0")}`;
    const currentNormalized = normalizeTime(currentFormatted);

    for (const auto of activeAutomations) {
      if (!auto.call_time) continue;
      const targetNormalized = normalizeTime(auto.call_time);

      console.log(`Cron running... Current Time (IST): ${currentNormalized} | Target (${auto.username || 'default'}): ${targetNormalized}`);

      if (currentNormalized === targetNormalized) {
        console.log(`⏰ Time matched for user ${auto.username || 'default'}! Triggering daily automated calls...`);
        const farmers = await getAllFarmers(auto.username);
        await callAllFarmers(farmers);
      }
    }
  } catch (error) {
    console.error("Cron Execution Error:", error.message || error);
  }
});

console.log("Automation Scheduler Started");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
