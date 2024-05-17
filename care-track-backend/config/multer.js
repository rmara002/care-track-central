// Importing necessary modules
import multer from "multer"; // For handling file uploads
import path from "path"; // For working with file paths

// Maximum file size allowed
const maxSize = 1 * 1024 * 1024; // 1MB

// Function to validate file type
var validateFile = function (file, cb) {
  // Regular expression to allow only jpeg, jpg, and png files
  let allowedFileTypes = /jpeg|jpg|png/;
  // Checking file extension
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  // Checking MIME type
  const mimeType = allowedFileTypes.test(file.mimetype);
  // If both extension and MIME type are valid, proceed
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    // If not valid, return an error
    return cb(new Error("Invalid file type. Only images are allowed."));
  }
};

// Configuration for storing uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Setting the destination folder where files will be stored
    cb(null, "/uploads/");
  },
  filename: (req, file, cb) => {
    // Generating a unique filename for the uploaded file
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

// Configuration for multer middleware to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Using memory storage to temporary upload files 
  fileFilter: function (req, file, callback) {
    // Calling the validateFile function to check file type
    validateFile(file, callback);
  },
  limits: { fileSize: maxSize }, // Limiting the file size
}).single("file"); // Accepting only single file uploads with field name "file"

// Exporting the upload middleware for use in other files
export default upload;
