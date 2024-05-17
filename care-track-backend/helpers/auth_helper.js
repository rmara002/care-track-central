import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds for hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password
    return hashedPassword; // Return the hashed password
  } catch (error) {
    console.log(error); // Log any errors that occur during the hashing process
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export function generateUniqueId() {
  // Define the characters that can be used in the unique ID
  const randomChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Initialize an empty string for the unique ID
  let uniqueId = "";

  // Construct the unique ID by randomly selecting characters from `randomChars`
  for (let i = 0; i < 10; i++) {
    uniqueId += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }

  return uniqueId; // Return the generated unique ID
}
