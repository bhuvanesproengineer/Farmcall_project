import express from "express";

const router = express.Router();

// GET /
router.get("/", (req, res) => {
  res.status(200).send("FarmCall backend is running");
});

// GET /health
router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// GET /test
router.get("/test", (req, res) => {
  res.send("BACKEND_WORKING");
});

export default router;
