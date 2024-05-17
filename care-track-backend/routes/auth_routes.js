import express from "express";

// Importing controllers and middlewares
import {
  loginController,
  registerController,
  updatePassword,
} from "../controllers/auth_controller.js";
import { isAdmin, requireSignIn } from "../middlewares/auth_middleware.js";
import {
  GetCarePlan,
  approveRegularStaff,
  createResident,
  declineRegularStaff,
  editResident,
  resident_feed,
  update_icon,
} from "../controllers/resident_controller.js";
import {
  deleteResident,
  deleteStaffMember,
  residents,
  staffMembers,
} from "../controllers/member_resident.js";
import { updateUser } from "../controllers/user_controller.js";
import upload from "../config/multer.js";

// Creating router object
const router = express.Router();

// Routing

// REGISTER endpoint - Method: POST
router.post("/register", registerController);

// LOGIN endpoint - Method: POST
router.post("/login", loginController);

// Update Password endpoint - Method: POST
router.post("/update-password", updatePassword);

// Update Profile endpoint - Method: POST
router.post("/update-profile", requireSignIn, upload, updateUser);

// Resident Endpoints

// Create Resident endpoint - Method: POST
router.post("/create-resident", requireSignIn, isAdmin, upload, createResident);

// Approve Regular Staff endpoint - Method: PUT
router.put(
  "/approve-regular-staff/:userId",
  requireSignIn,
  isAdmin,
  approveRegularStaff
);

// Decline Regular Staff endpoint - Method: POST
router.post(
  "/decline-regular-staff/:userId",
  requireSignIn,
  isAdmin,
  declineRegularStaff
);

// Get Care Plan endpoint - Method: GET
router.get("/care-plan/:residentId", requireSignIn, GetCarePlan);

// Edit Care Plan endpoint - Method: PUT
router.put("/edit-care-plan/:residentId", requireSignIn, editResident);

// Add/Update Icon endpoint - Method: PUT
router.put("/resident/icon/:id", requireSignIn, upload, update_icon);

// Resident Feed endpoint - Method: GET
router.get("/residents/:residentId/feed", requireSignIn, resident_feed);

// Other Staff Members Endpoints

// All Staff Members endpoint - Method: GET
router.get("/staff-members", requireSignIn, staffMembers);

// Delete Staff Member endpoint - Method: DELETE
router.delete("/staff-member/:id", requireSignIn, deleteStaffMember);

// All Residents endpoint - Method: GET
router.get("/residents", requireSignIn, residents);

// Delete Resident endpoint - Method: DELETE
router.delete("/resident/:id", requireSignIn, deleteResident);

export default router;
