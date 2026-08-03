import express from "express";
import {
  storeFarmerData,
  getAllFarmers,
  updateFarmer,
  deleteFarmer,
  deleteAllFarmers
} from "../database/db.js";

const router = express.Router();

// POST /farmers/register
router.post("/register", async (req, res) => {
  storeFarmerData(req.body, req.username)
    .then(() => {
      res.status(200).json({ message: "Farmer data stored successfully" });
    })
    .catch((error) => {
      console.error("Error storing farmer data:", error);
      res.status(500).json({ message: "Error storing farmer data" });
    });
});

// GET /farmers/
router.get("/", async (req, res) => {
  try {
    const farmers = await getAllFarmers(req.username);
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

// PUT /farmers/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedFarmer = await updateFarmer(id, updatedData, req.username);

    if (!updatedFarmer) {
      return res.status(404).json({
        message: "Farmer not found"
      });
    }

    res.status(200).json({
      message: "Farmer updated successfully",
      data: updatedFarmer
    });
  } catch (error) {
    console.error("Error updating farmer:", error);
    res.status(500).json({
      message: "Error updating farmer"
    });
  }
});

// DELETE /farmers/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteFarmer(id, req.username);
    res.status(200).json({
      message: "Farmer deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting farmer:", error);
    res.status(500).json({
      message: "Error deleting farmer"
    });
  }
});

// DELETE /farmers/
router.delete("/", async (req, res) => {
  try {
    const result = await deleteAllFarmers(req.username);
    res.status(200).json({
      success: true,
      message: "All farmers deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete all farmers"
    });
  }
});

export default router;
