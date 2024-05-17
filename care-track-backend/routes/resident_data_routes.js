import express from "express"; // Importing Express framework
import { requireSignIn } from "../middlewares/auth_middleware.js"; // Importing authentication middleware to protect routes
import {
  createFeedMessage,
  deleteFeedMessage,
  getResidentFeedMessages,
  updateFeedMessage,
} from "../controllers/resident_controller.js"; // Importing controller functions for handling feed messages from resident controller

// Creating an instance of Express Router
const router = express.Router();

// Route to create a new feed message
router.post("/feed-message", requireSignIn, createFeedMessage);

// Route to get feed messages for a specific resident
router.get("/feed-messages/:id", requireSignIn, getResidentFeedMessages);

// Route to delete a specific feed message
router.delete("/feed-message/:id", requireSignIn, deleteFeedMessage);

// Route to update a specific feed message
router.put("/feed-message/:id", requireSignIn, updateFeedMessage);

// Exporting the router to make it accessible to other parts of the application
export default router;
