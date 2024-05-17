// Importing the 'db' object from the '../config/db.js' file
import db from "../config/db.js";

// Controller function to fetch staff members from the database
export const staffMembers = async (req, res) => {
  try {
    // Fetch all staff members from the database except the current user and users that are not deleted
    const [staffMembers] = await db.execute(
      "SELECT * FROM users WHERE id != ? AND is_deleted = ?",
      [req.user._id, false] // Parameters for the SQL query, 'req.user._id' is the current user's ID
    );

    // Return the list of staff members as a JSON response
    res.status(200).json({ staffMembers });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// This function deletes a staff member from the database.
export const deleteStaffMember = async (req, res) => {
  try {
    // Delete any records associated with the staff member from the resident_data_update table.
    await db.execute("DELETE FROM resident_data_update WHERE posted_by = ?", [
      req.params?.id, // The staff member's id is obtained from the request parameters.
    ]);

    // Delete the staff member's record from the users table.
    await db.execute("DELETE FROM users WHERE id = ?", [req.params?.id]);

    // Send a successful response back to the client.
    res.status(200).json({
      success: true,
      message: "Staff Deleted Successfully.",
    });
  } catch (error) {
    // If an error occurs during the deletion process, send an error response back to the client.
    res.status(500).json({ message: error?.message });
  }
};

export const residents = async (req, res) => {
  try {
    // Fetch all residents from the database that are not deleted
    const [residents] = await db.execute(
      "SELECT * FROM residents WHERE is_deleted = ?",
      [false]
    );

    // Return the list of residents
    res.status(200).json({ residents });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Endpoint to delete resident
export const deleteResident = async (req, res) => {
  try {
    // Delete any records associated with the resident from the resident_data_update table.
    await db.execute("DELETE FROM resident_care_plan WHERE resident_id = ?", [
      req.params?.id, // The resident's id is obtained from the request parameters.
    ]);

    // Delete any records associated with the resident from the resident_data_update table.
    await db.execute("DELETE FROM resident_data_update WHERE resident_id = ?", [
      req.params?.id, // The resident's id is obtained from the request parameters.
    ]);

    //Delete the resident
    await db.execute("DELETE FROM residents WHERE id = ?", [req.params?.id]);

    //Return success response
    res.status(200).json({
      success: true,
      message: "Resident Deleted Successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
};
