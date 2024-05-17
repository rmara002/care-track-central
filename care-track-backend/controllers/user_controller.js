import db from "../config/db.js"; // Importing database configuration
import env from "dotenv"; // Importing environment variables
import storage from "../config/fire_config.js"; // Importing Firebase storage configuration
env.config(); // Configuring environment variables

// Endpoint to update user information
export const updateUser = async (req, res) => {
  try {
    const { fullname } = req.body; // Destructuring fullname from request body

    // Fetching user data from the database based on user id from request
    let [user] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user?._id,
    ]);

    // Checking if user data exists
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "no user found",
      });
    }

    let file = req.file; // Getting file from request
    let icon = user[0]?.icon ? user[0]?.icon : null; // Setting initial icon value from user data

    // Checking if file exists in the request
    if (file) {
      // Initializing Firebase storage bucket
      const bucket = await storage.bucket("gs://care-track-b4d79.appspot.com");

      // Generating a custom filename
      let customName = `${Date.now() + "-" + file.originalname}`;
      const fileName = `user/images/${customName}`;
      const fileUpload = bucket.file(fileName);

      // Uploading file to Firebase storage
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Setting icon URL after uploading file
      icon = `https://firebasestorage.googleapis.com/v0/b/care-track-b4d79.appspot.com/o/user%2Fimages%2F${customName}?alt=media`;
    }

    // Updating user information in the database
    await db.execute("UPDATE users SET fullname = ?, icon = ? WHERE id = ?", [
      fullname,
      icon,
      req.user?._id,
    ]);

    // Fetching updated user data from the database
    let [updateUser] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user?._id,
    ]);

    // Sending response with updated user data and success message
    return res.status(200).send({
      success: true,
      user: {
        name: updateUser[0]?.username,
        role: updateUser[0]?.role,
        status: updateUser[0]?.status,
        fullname: updateUser[0]?.fullname,
        icon: updateUser[0]?.icon,
      },
      message: "user Updated Successfully",
    });
  } catch (error) {
    // Handling errors and sending error response
    return res.status(400).json({ success: false, message: error?.message });
  }
};
