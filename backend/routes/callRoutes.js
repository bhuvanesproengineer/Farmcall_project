import express from "express";
import { callAllFarmers } from "../services/callAllFarmers.js";
import { callStore } from "../services/makeCall.js";
import { backupMsg } from "../services/backupMsg.js";
import {
  getAllFarmers,
  storeCallLog,
  getCallLogs,
  clearCallLogs
} from "../database/db.js";

const router = express.Router();

// POST /calls/call-all
router.post("/call-all", async (req, res) => {
  const farmers = await getAllFarmers(req.username);
  console.log(farmers);

  await callAllFarmers(farmers);

  res.status(200).json({
    message: "Calling process started"
  });
});

// POST /calls/status
router.post("/status", async (req, res) => {
  try {
    const params = { ...(req.query || {}), ...(req.body || {}), ...(req.body ? {} : req) };
    const status = params.CallStatus;
    const duration = Number(params.CallDuration || 0);
    const callSid = params.CallSid;

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
        callData.language,
        callData.callType
      );
    } catch (error) {
      smsStatus = "failed";
    }

    await storeCallLog(
      callData.farmerName,
      callData.phoneNumber,
      status,
      duration,
      smsStatus,
      callData.username
    );

    delete callStore[callSid];

    res.sendStatus(200);
  } catch (error) {
    console.error("Callback Error:", error);
    res.sendStatus(500);
  }
});

// GET /calls/logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await getCallLogs(req.username);

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

// DELETE /calls/logs
router.delete("/logs", async (req, res) => {
  try {
    const result = await clearCallLogs(req.username);

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

export default router;
