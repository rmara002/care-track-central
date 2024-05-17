import express from "express"; // Importing Express framework for building the web application
import cors from "cors"; // Importing CORS middleware for enabling cross-origin resource sharing
import env from "dotenv";

//Importing Routes

import authRoutes from "./routes/auth_routes.js"; // Importing authentication routes
import residentDataRoutes from "./routes/resident_data_routes.js"; // Importing resident data routes

// Load the environment variables
env.config();

// Import the database configuration
import db from "./config/db.js";

// Middleware function to add a 'newNotifications' key to the response JSON
const addSuccessKey = async (req, res, next) => {
  const originalJson = res.json;

  // Query the database to check for pending staff members
  const [staffMembers] = await db.execute(
    "SELECT * FROM users WHERE status = ?",
    ["pending"]
  );

  let newNotifications = false;
  if (staffMembers?.length > 0) {
    newNotifications = true;
  }

  // Override the json function to add 'newNotifications' key to response data
  res.json = function (data) {
    const newData = {
      newNotifications: newNotifications,
      ...data,
    };
    originalJson.call(this, newData);
  };
  next();
};

// Create the Express app
const app = express();

app.use(cors()); // Adding CORS middleware to enable cross-origin requests

const PORT = process.env.PORT; // Getting the port number from environment variables

app.use(express.json()); // Adding middleware to parse incoming JSON requests

// Use the routes
//Mount Routes
app.use(
  "/api/v1/auth",
  addSuccessKey, // Adding the custom middleware to add 'newNotifications' key to response
  authRoutes,
  residentDataRoutes
);

// Default Route
app.get("/", async (req, res) => {
  res.send("Welcome to the care home"); // Responding with a welcome message for the root endpoint
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Application is running on the ${PORT}`); // Logging the port number the server is running on
});
