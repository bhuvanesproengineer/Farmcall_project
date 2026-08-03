import express from "express";
import { getFarmcall } from "../services/farmcall.js";

const router = express.Router();

// POST /farmcall/
router.post("/", getFarmcall);

export default router;
