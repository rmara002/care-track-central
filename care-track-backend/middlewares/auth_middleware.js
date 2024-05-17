import JWT from "jsonwebtoken";
import db from "../config/db.js";
import env from "dotenv";
env.config(); // Load environment variables from .env file into process.env

/**
 * Middleware to verify if the request is authorized with a valid JSON Web Token.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @param {Function} next - The next middleware function in the stack.
 */
export const requireSignIn = async (req, res, next) => {
  try {
    // Check if the authorization header is present
    const token = req.headers.authorization;
    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized request");
    }

    // Extract the token from the authorization header
    let tokenSplit = req.headers.authorization.split(" ")[1];

    // Check if the token is null
    if (tokenSplit === "null") {
      return res.status(401).send("Unauthorized request");
    }

    // Verify the token using the secret key and decode the payload
    let payload = JWT.verify(tokenSplit, process.env.JWT_SECRET);

    // Verify the token using the secret key and decode the payload
    if (!payload) {
      return res.status(401).send("Unauthorized request");
    }
    req.user = payload;
    next();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Middleware to check if the logged-in user is an admin.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @param {Function} next - The next middleware function in the stack.
 */
export const isAdmin = async (req, res, next) => {
  try {
    // Retrieve the user details from the database
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user._id,
    ]);

    // Check if the user exists and has an admin role (role = 1)
    if (!user || user.length === 0 || user[0].role !== 1) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
