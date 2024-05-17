import { z } from "zod";
const text = z.string().min(5, {
  message: "Post is required of minimum 5 words",
});
const weight_type = z.string().min(1, {
  message: "Value can't be empty",
});

//  Auth Verification

export const Signup_Schema = z.object({
  fullname: z.string().min(3, {
    message: "Full Name must be at least 3 characters.",
  }),
  username: z.string().min(3, {
    message: "Email must be at least 3 characters.",
  }),
  role: z.enum(
    [
      "manager",
      "nurse",
      "senior carer",
      "carer",
      "activitystaff",
      "physiotherapists",
    ],
    {
      required_error: "You need to select a role.",
    }
  ),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  // file: z.union([z.null(), z.instanceof(File)]),
});
export const Login_Schema = z.object({
  username: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  fullname: z.union([z.string(), z.undefined()]).optional(),
});

// Feed Post verification

export const personal_Care = z.object({
  message: text,
});
export const weight = z.object({
  weight: weight_type,
});
export const food_intake = z.object({
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"], {
    required_error: "You need to select a meal type.",
  }),
  text: text,
  weight: weight_type,
});
export const fluid_intake = z.object({
  text: text,
  weight: weight_type,
});
export const create_resident = z.object({
  name: z.string().min(3, { message: "Name is Required min 3 words" }),
  birthday: z.date({ required_error: "A date of birth is required." }),
  roomNumber: z.coerce.number().min(1),
});
const smtxt = z.string({ required_error: "Value is required" });
export const accident = z.object({
  reporting: text,
  date: z.date(),
  location: text,
  happend: text,
  category: smtxt,
  witness: text,
  person_completing: text,
  injuried_person_work: smtxt,
  injuried_person_no_work: text,
  treatment: smtxt,
  injury_type: smtxt,
  Who_was_involved: smtxt,
  completed: z.string({ required_error: "Value is required" }),
});

//Auth
export type Signup_Schema_type = z.infer<typeof Signup_Schema>;
export type Login_Schema_type = z.infer<typeof Login_Schema>;

// Feeds
export type personal_Care_type = z.infer<typeof personal_Care>;
export type weight_type = z.infer<typeof weight>;
export type food_intake_type = z.infer<typeof food_intake>;
export type fluid_intake_type = z.infer<typeof food_intake>;
export type create_resident_type = z.infer<typeof create_resident>;
export type accident_type = z.infer<typeof accident>;
