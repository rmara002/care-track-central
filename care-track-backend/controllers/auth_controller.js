import db from "../config/db.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/auth_helper.js";
import env from "dotenv";
env.config();
import nodemailer from "nodemailer";

//Transporter to send email
//Gmail
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "", //email address (gmail only)
    pass: "", //google app password https://support.google.com/mail/answer/185833?hl=en
  },
  tls: {
    rejectUnauthorized: false,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});
// Register a New User
export const registerController = async (req, res) => {
  var status = ""; // Initialize status variable

  try {
    let { username, password, role, fullname } = req.body; // Destructure request body
    let user_role = req.body.role; // Assign role from request body

    // Determine role and set status accordingly
    if (
      req.body.role == "manager" ||
      req.body.role == "nurse" ||
      req.body.role == "senior carer"
    ) {
      role = 1; // Set role to 1 for admins
      status = "pending"; // Set status to pending. Admin will Approve them
    } else {
      role = 0; // Set role to 0 for users
      status = "pending"; // Set status to pending.  Admin will Approve them
    }

    // Check if the username(email) is already taken
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email is already taken." }); // Return error if username(email) is already taken
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const user = await db.execute(
      "INSERT INTO users (username, password, role, user_role, status, fullname) VALUES (?, ?, ?, ?, ?, ?)",
      [username, hashedPassword, role, user_role, status, fullname || ""]
    );

    // Generate JWT token
    const token = jwt.sign({ _id: user[0].insertId }, process.env.JWT_SECRET, {
      expiresIn: "8d",
    });

    // Prepare email data
    const mailData = {
      from: "", // Add sender email
      to: username, // Recipient's email
      subject: "Registration", // Email subject
      text: "You are Registered", // Plain text body
      html: `<h2>You successfully registered to Care Track Central. Await for admin approval and an email will be sent out to you once you have been approved by an admin.<h2/>`, // HTML body
    };

    // Send registration email
    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        return console.log(error); // Log error if email sending fails
      }
    });

    // Send success response with token
    res.status(201).json({
      success: true,
      token,
      message: "Registration successful.",
    });
  } catch (error) {
    console.error(error); // Log error to console
    res.status(500).json({ success: false, message: "Internal Server Error" }); // Send internal server error response
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check if the user exists in the database
    const [user] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    // If user does not exist
    if (!user || user.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    } else if (user[0].status == "pending") {
      // If user status is 'pending'
      console.log(user[0].status);
      return res
        .status(401)
        .json({ message: "Awaiting admin approval. Please check your email." });
    }

    // Verify the password
    const passwordMatch = await comparePassword(password, user[0].password);

    // If password does not match
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "8d",
    });

    // Send success response with token and user details
    res.status(200).send({
      token,
      success: true,
      message: "login successfully",
      user: {
        id: user[0]?.id,
        name: user[0].username,
        role: user[0].role,
        status: user[0].status,
        fullname: user[0].fullname,
        icon: user[0].icon,
      },
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update the password
export const updatePassword = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const [user] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password in the database with the new password
    await db.execute("UPDATE users SET password = ? WHERE username = ?", [
      hashedPassword,
      username,
    ]);

    // Return a success message
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
