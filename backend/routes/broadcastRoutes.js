import express from "express";
import { createBroadcast } from "../services/broad_cast.js";

const router = express.Router();

// POST /broadcast/alert
router.post("/alert", createBroadcast);

export default router;
