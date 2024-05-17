// Interfaces for defining structure and types for various entities and operations in the application.

/**
 * Describes the structure for user login information.
 */

export interface LoginUser {
  id: Number;
  fullname: string;
  username: string;
  role: number;
  token: string;
  status: string;
  password: string;
  icon: string;
}

/**
 * Represents a user's key data, especially after authentication.
 */
export interface User {
  token: string;
  fullname: string;
  username: string;
  role: string;
  message: string;
}

/**
 * Describes the structure for a login request, typically used in authentication processes.
 */
export interface LoginRequest {
  username: string;
  password: string;
  file?: File | null;
  fullname?: string;
}

/**
 * Describes the application's authentication state, used in state management.
 */
export interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

/**
 * Detailed structure for a staff member, potentially extending a User.
 */
export interface StaffMember {
  id: number;
  fullname: string;
  username: string;
  role: 0;
  status: string;
  created_at: Date;
}

/**
 * Basic key-value pair structure used for dropdown options, etc.
 */
export type Option = {
  value: string;
  label: string;
};

/**
 * Represents a resident in the care home, with personal and room details.
 */
export interface Resident {
  icon: string;
  id: number;
  name: string;
  birthday: Date;
  room_number: number;
  created_at: Date;
}

/**
 * Describes the expected structure of a response when a resident is created.
 */
export interface CreateResidentResponse {
  message: string;
}

/**
 * Describes the expected structure of the response when fetching residents.
 */
export interface FetchResidentsResponse {
  residents: Resident[];
}

/**
 * Describes the expected structure of the response when deleting a resident.
 */
export interface DeleteResidentsResponse {
  message: string | null;
  id: string;
}

/**
 * Represents detailed information about a resident's care plan.
 */
export interface CarePlan {
  updates: any;
  id: number;
  resident_id: number;
  name: string;
  birthday: Date;
  room_number: number;
  care_instructions: string | null;
  medication_schedule: string | null;
  age: string | null;
  medical_history: string | null;
  allergies: string | null;
  medications: string | null;
  key_contacts: string | null;
  support: string | null;
  behavior: string | null;
  personal_care: string | null;
  mobility: string | null;
  sleep: string | null;
  nutrition: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: Date;
  icon: string;
}

/**
 * Response structure when fetching a care plan for a resident.
 */
export interface GetCarePlanResponse {
  carePlan: CarePlan | null;
}

/**
 * Defines the structure for a request to edit resident details.
 */
export interface EditResidentRequest {
  residentId: number;
  name?: string;
  birthday?: Date;
  roomNumber?: number;
  careInstructions?: string;
  medicationSchedule?: string;
  age?: number;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  keyContacts?: string;
  support?: string;
  behavior?: string;
  personalCare?: string;
  mobility?: string;
  sleep?: string;
  nutrition?: string;
}

/**
 * Extends CarePlan to include fields relevant to an edited resident's response.
 */
export interface EditResidentResponse extends CarePlan {
  updated_by: string | null;
}

/**
 * Details for personal care data, including metadata about the submission.
 */
export interface FeedPostInterface {
  posted_by_name: string;
  created_at: Date;
  message: string;
  timestamp: Date;
  id: string;
  posted_by: Number;
  updated_at: Date;
}

/**
 * State interface for managing all personal care related data and application states regarding residents.
 */
export interface ResidentState {
  personalHygienePosts: FeedPostInterface[];
  personalCarePosts: FeedPostInterface[];
  weightPosts: FeedPostInterface[];
  oxygenSaturationPosts: FeedPostInterface[];
  pulseRatePosts: FeedPostInterface[];
  temperaturePosts: FeedPostInterface[];
  bloodSugarPosts: FeedPostInterface[];
  bowelMovementPosts: FeedPostInterface[];
  bodyMapPosts: FeedPostInterface[];
  fluidIntakePosts: FeedPostInterface[];
  foodIntakePosts: FeedPostInterface[];
  incidentAccidentPosts: FeedPostInterface[];
  searchFeedPosts: FeedPostInterface[];
  loading: boolean;
  error: any;
}

/**
 * Defines the structure for posting a message related to a resident.
 */
export interface PostMessageRequest {
  residentId: number;
  message: string;
}

export interface DeleteMessageRequest {
  residentId: string | undefined;
  messageId: string;
}

/**
 * Structure used to define new or edited message data.
 */
export interface MessageData {
  messageId: string;
  newMessage: string;
}
