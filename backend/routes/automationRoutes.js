import express from "express";
import {
  startAutomation,
  stopAutomation,
  getAutomation
} from "../database/db.js";

const router = express.Router();

// POST /automation/start
router.post("/start", async (req, res) => {
  try {
    const params = { ...(req.query || {}), ...(req.body || {}), ...(req.body ? {} : req) };
    const callTime = params.callTime || params.call_time;
    await startAutomation(callTime, req.username);
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

// POST /automation/stop
router.post("/stop", async (req, res) => {
  try {
    await stopAutomation(req.username);
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

// GET /automation/status
router.get("/status", async (req, res) => {
  try {
    const automation = await getAutomation(req.username);
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

export default router;
