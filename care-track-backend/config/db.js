// Import the mysql library and promise type
import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Configure the dotenv library
dotenv.config();

// Define the database configuration
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

// Create a connection pool to the database
const pool = mysql.createPool(dbConfig);

// Export the connection pool for use in other files
export default pool;
