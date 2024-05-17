import moment from "moment";
import db from "../config/db.js"; // Importing database configuration
import env from "dotenv";
env.config(); // Configuring environment variables
import nodemailer from "nodemailer"; // Importing nodemailer package to send email
import storage from "../config/fire_config.js"; // Importing Firebase storage configuration

//Transporter to send email
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

//Endpoint to create a resident
export const createResident = async (req, res) => {
  try {
    // Extract resident information from request body
    let { name, birthday, roomNumber } = req.body;

    // Convert birthday to a formatted date string
    const originalDate = new Date(birthday);
    const formattedDate = originalDate.toISOString().split("T")[0];

    // Check if we have a file in request payload
    let file = req.file;
    let icon = null;
    if (file) {
      // upload the file to firebase storage
      const bucket = await storage.bucket("gs://care-track-b4d79.appspot.com"); //storage bucket name
      let customName = `${Date.now() + "-" + file.originalname}`; //custom name for file
      const fileName = `resident/images/${customName}`; // path to the file
      //file uploading function
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Get the URL of the saved file
      icon = `https://firebasestorage.googleapis.com/v0/b/care-track-b4d79.appspot.com/o/resident%2Fimages%2F${customName}?alt=media`;
    }

    // Insert new resident into the database
    const [resident] = await db.execute(
      "INSERT INTO residents (name, birthday, room_number,icon) VALUES (?, ?, ?, ?)",
      [name, formattedDate, roomNumber, icon]
    );

    // Get the ID of the newly inserted resident
    const residentId = resident.insertId;

    // Insert the resident key into the resident_care_plan table
    await db.execute(
      "INSERT INTO resident_care_plan (resident_id, name, birthday, room_number) VALUES (?, ?, ?, ?)",
      [residentId, name, formattedDate, roomNumber]
    );

    // Return success message
    res.status(201).json({ message: "New resident created successfully." });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Endpoint to create a new feed message
export const createFeedMessage = async (req, res) => {
  try {
    // Destructuring data from request body
    const { message, resident_id, type } = req.body;

    // Inserting new message into the database
    const post = await db.execute(
      "INSERT INTO resident_data_update (resident_id,message,type, posted_by) VALUES (?, ?, ?, ?)",
      [resident_id, message, type, req.user?._id]
    );

    // Sending success response
    res.status(201).json({
      success: true,
      message: "Message posted successfully.",
    });
  } catch (error) {
    // Handling errors
    res.status(500).json({ message: error?.message });
  }
};

// Function to retrieve feed messages of a resident
export const getResidentFeedMessages = async (req, res) => {
  try {
    // Extracting resident ID from request parameters
    let resident_id = req.params?.id;

    // Querying resident data from the database
    let [resident] = await db.execute(
      "select * FROM residents WHERE id = ? AND is_deleted = ?",
      [req.params?.id, false]
    );

    // Checking if resident exists
    if (resident?.length > 0) {
      let query =
        "SELECT r.*, u.username, u.role, u.fullname AS posted_by_name, u.id AS user_id FROM resident_data_update AS r JOIN users AS u ON r.posted_by = u.id WHERE r.resident_id = ?";
      const queryParams = [resident_id];

      // Check if date is provided in query parameters
      if (req.query.date) {
        query += " AND DATE(r.created_at) = ?";
        queryParams.push(req.query.date);
      }

      // Check if type is provided in query parameters
      if (req.query.type) {
        query += " AND r.type = ?";
        queryParams.push(req.query.type);
      }

      // Adding order by clause
      query += " ORDER BY r.created_at DESC";

      // Executing query to fetch data
      const [data] = await db.execute(query, queryParams);

      // Sending success response with fetched data
      res.status(200).json({
        success: true,
        data: data,
        message: "Data retrieved successfully.",
      });
    } else {
      // Sending success response with empty data if resident not found
      res.status(200).json({
        success: true,
        data: [],
        message: "Data retrieved successfully.",
      });
    }
  } catch (error) {
    // Handling errors
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to delete a feed message
export const deleteFeedMessage = async (req, res) => {
  try {
    // Fetching message data from the database
    let [data] = await db.execute(
      "select * FROM resident_data_update WHERE id = ?",
      [req.params?.id]
    );

    // Checking if message exists and user is authorized to delete it
    if (data && data?.posted_by == req.user?.id) {
      // Deleting message from the database
      const deleteResult = await db.execute(
        "DELETE FROM resident_data_update WHERE id = ?",
        [req.params?.id]
      );
      // Sending success response
      res.status(200).json({
        success: true,
        message: "Message Deleted Successfully.",
      });
    } else {
      // Sending error response if user is not authorized to delete the message
      res.status(400).json({
        success: false,
        message: "You are not allowed to delete this message",
      });
    }
  } catch (error) {
    // Handling errors
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to update a feed message
export const updateFeedMessage = async (req, res) => {
  try {
    // Updating message in the database
    const updateResult = await db.execute(
      "UPDATE resident_data_update SET message = ?, updated_at = CURRENT_TIMESTAMP() WHERE id = ?",
      [req.body?.message, req.params?.id]
    );
    // Sending success response
    res.status(200).json({
      success: true,
      message: "Message Updated Successfully.",
    });
  } catch (error) {
    // Handling errors
    console.error(error);
    res.status(500).json({ message: error?.message });
  }
};

// EndPoint to approve regular staff
export const approveRegularStaff = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    // Fetch user from the database using userId
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    // Update user's status to approved in the database
    await db.execute('UPDATE users SET status = "approve" WHERE id = ?', [
      userId,
    ]);

    // Check if user exists
    if (existingUser[0]) {
      // Prepare email data
      const mailData = {
        from: "", // Specify sender email address
        to: existingUser[0].username, // Send email to user's email address
        subject: "Registration", // Email subject
        text: "Admin Approval", // Plain text content
        html: `<h2>You have been successfully approved by an admin. Please login to start using Care Track Central.<h2/>`, // HTML content
      };

      // Send email using transporter
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          return console.log(error); // Log error if sending email fails
        }
      });
    }

    // Return success message
    res.status(200).json({ message: "Regular staff approved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" }); // Return internal server error response
  }
};

// EndPoint to decline regular staff
export const declineRegularStaff = async (req, res) => {
  try {
    // Extracting userId from request parameters
    const { userId } = req.params;

    // Delete user from the database using userId
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);

    // Sending success response if deletion is successful
    res.status(200).json({ message: "Regular staff declined successfully." });
  } catch (error) {
    // Handling errors if any occur during the process
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Endpoint to Update Resident and resident_care_plan details
export const editResident = async (req, res) => {
  try {
    // Extracting residentId from request parameters
    const { residentId } = req.params;
    const {
      name,
      birthday,
      roomNumber,
      care_instructions,
      medication_schedule,
      age,
      medical_history,
      allergies,
      medications,
      key_contacts,
      support,
      behavior,
      personal_care,
      mobility,
      sleep,
      nutrition,
    } = req.body; // Destructure request body

    //Fetch User Details
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user._id,
    ]);

    //Fetch Resident Care Plan Details
    const [resident] = await db.execute(
      "SELECT * FROM resident_care_plan WHERE resident_id = ?",
      [residentId]
    );

    //Fetch Existing Resident Care Plan Details
    const [existcarePlan] = await db.execute(
      "SELECT * FROM resident_care_plan WHERE resident_id = ?",
      [residentId]
    );
    // Format the date To YYY-MM-DD using moment
    const formattedDate = moment(resident[0].birthday).format("YYYY-MM-DD");

    // Replace undefined values with existing values from the database
    const nullableName = name !== undefined ? name : resident[0].name;
    const nullableBirthday = birthday !== undefined ? birthday : formattedDate;
    const nullableRoomNumber =
      roomNumber !== undefined ? roomNumber : resident[0].room_number;
    const nullableCareInstructions =
      care_instructions !== undefined
        ? care_instructions
        : existcarePlan[0].care_instructions;
    const nullableMedicationSchedule =
      medication_schedule !== undefined
        ? medication_schedule
        : existcarePlan[0].medication_schedule;
    const nullableAge = age !== undefined ? age : existcarePlan[0].age;
    const nullableMedicalHistory =
      medical_history !== undefined
        ? medical_history
        : existcarePlan[0].medical_history;
    const nullableAllergies =
      allergies !== undefined ? allergies : existcarePlan[0].allergies;
    const nullableMedications =
      medications !== undefined ? medications : existcarePlan[0].medications;
    const nullableKeyContacts =
      key_contacts !== undefined ? key_contacts : existcarePlan[0].key_contacts;
    const nullableSupport =
      support !== undefined ? support : existcarePlan[0].support;
    const nullableBehavior =
      behavior !== undefined ? behavior : existcarePlan[0].behavior;
    const nullablePersonalCare =
      personal_care !== undefined
        ? personal_care
        : existcarePlan[0].personal_care;
    const nullableMobility =
      mobility !== undefined ? mobility : existcarePlan[0].mobility;
    const nullableSleep = sleep !== undefined ? sleep : existcarePlan[0].sleep;
    const nullableNutrition =
      nutrition !== undefined ? nutrition : existcarePlan[0].nutrition;

    // Parse updates JSON column from the existing care plan
    const updatedColumns = existcarePlan[0]?.updates
      ? JSON.parse(existcarePlan[0]?.updates)
      : {};

    // Function to check if a value is updated and add it to the updatedColumns object
    const checkAndUpdate = (value, columnName) => {
      if (value !== undefined && value !== existcarePlan[0][columnName]) {
        updatedColumns[columnName] = new Date();
      }
    };

    // Check and update each column
    checkAndUpdate(name, "name");
    checkAndUpdate(birthday, "birthday");
    checkAndUpdate(roomNumber, "room_number");
    checkAndUpdate(care_instructions, "care_instructions");
    checkAndUpdate(medication_schedule, "medication_schedule");
    checkAndUpdate(age, "age");
    checkAndUpdate(medical_history, "medical_history");
    checkAndUpdate(allergies, "allergies");
    checkAndUpdate(medications, "medications");
    checkAndUpdate(key_contacts, "key_contacts");
    checkAndUpdate(support, "support");
    checkAndUpdate(behavior, "behavior");
    checkAndUpdate(personal_care, "personal_care");
    checkAndUpdate(mobility, "mobility");
    checkAndUpdate(sleep, "sleep");
    checkAndUpdate(nutrition, "nutrition");

    // Update resident care plan details in the database
    const [updated_resident] = await db.execute(
      `
				UPDATE resident_care_plan 
				SET 
					name = ?, 
					birthday = ?, 
					room_number = ?,
					care_instructions = ?, 
					medication_schedule = ?, 
					age = ?, 
					medical_history = ?, 
					allergies = ?, 
					medications = ?, 
					key_contacts = ?, 
					support = ?, 
					behavior = ?, 
					personal_care = ?, 
					mobility = ?, 
					sleep = ?, 
					nutrition = ? ,
          updates = ?,
					updated_by = ?
				WHERE resident_id = ?
			`,
      [
        nullableName,
        nullableBirthday,
        nullableRoomNumber,
        nullableCareInstructions,
        nullableMedicationSchedule,
        nullableAge,
        nullableMedicalHistory,
        nullableAllergies,
        nullableMedications,
        nullableKeyContacts,
        nullableSupport,
        nullableBehavior,
        nullablePersonalCare,
        nullableMobility,
        nullableSleep,
        nullableNutrition,
        JSON.stringify(updatedColumns),
        user[0]?.username,
        residentId,
      ]
    );

    //Update resident details
    await db.execute(
      "UPDATE residents SET name = ?, birthday = ?, room_number = ? WHERE id = ?",
      [nullableName, nullableBirthday, nullableRoomNumber, residentId]
    );

    //Get updated resident_care_plan details
    const [carePlan] = await db.execute(
      "SELECT * FROM resident_care_plan WHERE resident_id = ?",
      [residentId]
    );
    // Return success message
    res.status(200).json({ carePlan: carePlan[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Endpoint to handle posting on a resident's feed
export const resident_feed = async (req, res) => {
  try {
    // Extract residentId and message from request parameters and body
    const { residentId } = req.params;
    const { message } = req.body;

    // Insert post on resident's feed in the database
    await db.execute(
      "INSERT INTO resident_feed (resident_id, message) VALUES (?, ?)",
      [residentId, message]
    );

    // Return success message if insertion is successful
    res.status(201).json({ message: "Posted on resident feed successfully." });
  } catch (error) {
    // If any error occurs during the process, Send a 500 Internal Server Error response
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Endpoint to fetch residents resident_care_plan
export const GetCarePlan = async (req, res) => {
  try {
    // Extract residentId from request params
    const { residentId } = req.params;

    // Fetch resident and their care plan from the database
    const [resident] = await db.execute(
      "SELECT * FROM residents WHERE id = ?",
      [residentId]
    );

    // Fetch resident's care plan from the database
    const [carePlan] = await db.execute(
      "SELECT * FROM resident_care_plan WHERE resident_id = ?",
      [residentId]
    );

    // Return resident details along with care plan
    res.status(200).json({
      carePlan: {
        ...carePlan[0],
        updates: JSON.parse(carePlan[0]?.updates),
        icon: resident[0]?.icon,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Endpoint to update resident's icon
export const update_icon = async (req, res) => {
  try {
    // Fetch resident data from the database based on the provided ID in request params
    let [resident] = await db.execute("SELECT * FROM  residents WHERE id = ?", [
      req.params?.id,
    ]);

    // Retrieve the file from request body
    let file = req.file;

    // Get the existing icon URL from the resident data or set it to null if it doesn't exist
    let icon = resident[0]?.icon ? resident[0]?.icon : null;

    // Check if there is a file in request body
    if (file) {
      // Initialize Firebase Storage bucket
      const bucket = await storage.bucket("gs://care-track-b4d79.appspot.com");

      // Generate a custom name for the file using the current timestamp and original filename
      let customName = `${Date.now() + "-" + file.originalname}`;

      // Construct the file path within the bucket
      const fileName = `resident/images/${customName}`;

      // Get a reference to the file in the bucket
      const fileUpload = bucket.file(fileName);

      // Save the file to Firebase Storage
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype, // Set the content type based on the uploaded file type e.g: png
        },
      });

      // Update the icon URL with the public URL of the uploaded file
      icon = `https://firebasestorage.googleapis.com/v0/b/care-track-b4d79.appspot.com/o/resident%2Fimages%2F${customName}?alt=media`;
    }

    // Update the resident's icon URL in the database
    await db.execute("UPDATE residents SET icon = ? WHERE id = ?", [
      icon, // New icon URL
      req.params?.id, // Resident ID
    ]);

    // Retrieve updated resident data from the database
    [resident] = await db.execute("SELECT * FROM  residents WHERE id = ?", [
      req.params?.id,
    ]);

    // Send success response with updated resident data
    res
      .status(201)
      .json({ message: "Icon Updated Successfully!!!", data: resident[0] });
  } catch (error) {
    // Send error response if any exception occurs
    res.status(500).json({ message: error?.message });
  }
};
