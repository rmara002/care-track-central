// Importing necessary modules
import admin from "firebase-admin"; // Firebase Admin SDK for Node.js
import fs from "fs"; // File system module for reading files

// Reading the service account JSON file and parsing it
const serviceAccount = JSON.parse(fs.readFileSync("./config/care-track-b4d79-firebase-adminsdk-8o7uj-3e58951350.json"));

// Initializing Firebase Admin SDK with the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Accessing Firebase Storage service
const storage = admin.storage();

// Exporting the storage instance for use in other parts of the application
export default storage;
