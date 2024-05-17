/**
 * Provides a set of async thunk actions for handling user authentication, profile updates, staff management, resident management, and feed post operations.
 *
 * The exported actions include:
 * - `registerUser`: Registers a new user.
 * - `loginUser`: Logs in an existing user.
 * - `UpdatePasswordAction`: Updates the password of an existing user.
 * - `updateProfile`: Updates the profile of an existing user.
 * - `fetchStaffMembers`: Fetches a list of staff members.
 * - `deleteStaffMember`: Deletes a staff member.
 * - `approveRegularStaff`: Approves or declines a regular staff member.
 * - `fetchResidents`: Fetches a list of residents.
 * - `createResident`: Creates a new resident.
 * - `deleteResident`: Deletes an existing resident.
 * - `updateResident`: Updates the icon of an existing resident.
 * - `getCarePlan`: Retrieves the care plan for a specific resident.
 * - `editResident`: Edits the care plan for a specific resident.
 * - `getCalenderPosts`: Retrieves feed posts for a specific resident and date.
 * - `getMessagesAsync`: Retrieves messages for a specific resident and message type.
 * - `PostAsyncThunk`: Creates a new async thunk action for posting a feed message.
 * - `DeleteAsyncThunk`: Creates a new async thunk action for deleting a feed message.
 * - `UpdateAsyncThunk`: Creates a new async thunk action for updating a feed message.
 */
import {
  CarePlan,
  CreateResidentResponse,
  DeleteMessageRequest,
  EditResidentRequest,
  EditResidentResponse,
  FeedPostInterface,
  FetchResidentsResponse,
  GetCarePlanResponse,
  LoginRequest,
  LoginUser,
  MessageData,
  StaffMember,
  User,
} from "@/lib/types";
import { Signup_Schema_type } from "@/lib/validation_feed_post";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../axiosInstance";

export const registerUser = createAsyncThunk<
  User,
  Signup_Schema_type,
  { rejectValue: string }
>("registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<User>("/register", userData);
    toast.success("Registration Successful. Please check your email.");
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message as string);
    return rejectWithValue("an error occured");
  }
});

export const loginUser = createAsyncThunk<
  LoginUser,
  LoginRequest,
  { rejectValue: string }
>("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response: any = await axiosInstance.post<LoginUser>(
      "/login",
      userData
    );
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    toast.success("Login Success");
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message as string);
    return rejectWithValue("an error occured");
  }
});
export const UpdatePasswordAction = createAsyncThunk<
  LoginUser,
  LoginRequest,
  { rejectValue: string }
>("update-password", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<LoginUser>(
      "/update-password",
      userData
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message as string);
    return rejectWithValue("an error occured");
  }
});

export const updateProfile = createAsyncThunk<
  LoginUser,
  LoginRequest,
  { rejectValue: string }
>("update-profile", async (profileData, { rejectWithValue }) => {
  try {
    const form = new FormData();
    if (profileData.file) {
      form.append("file", profileData.file);
    }
    if (profileData.fullname) {
      form.append("fullname", profileData.fullname);
    }

    const response = await axiosInstance.post<LoginUser>(
      "/update-profile",
      form
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    toast.error(error.response.data.message as string);
    return rejectWithValue("an error occured");
  }
});

export const fetchStaffMembers = createAsyncThunk<StaffMember[], void>(
  "staff/fetchStaffMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/staff-members");
      return response.data.staffMembers;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch staff members.");
    }
  }
);

export const deleteStaffMember = createAsyncThunk(
  "deleteStaffMember",
  async (id: number) => {
    const response = await axiosInstance.delete(`/staff-member/${id}`);
    return response.data.data;
  }
);

interface ApproveRegularStaffResponse {
  message: string;
}

export const approveRegularStaff = createAsyncThunk<
  ApproveRegularStaffResponse,
  { userId: string; status: string },
  { rejectValue: string }
>(
  "staff/approveRegularStaff",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response =
        status == "approve"
          ? await axiosInstance.put(`/approve-regular-staff/${userId}`)
          : await axiosInstance.post(`/decline-regular-staff/${userId}`);

      toast.success(
        `${status === "approve" ? "Approved" : "Declined"} Successfully`
      );
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message as string);
      console.error(error);
      return rejectWithValue("Failed to approve regular staff.");
    }
  }
);

export const fetchResidents = createAsyncThunk<FetchResidentsResponse>(
  "fetchResidents",
  async () => {
    const response = await axiosInstance.get("/residents");
    return response.data;
  }
);
interface ResidentPayload {
  name: string;
  birthday: Date;
  file: null | any;
  roomNumber: number;
}

export const createResident = createAsyncThunk<
  CreateResidentResponse,
  ResidentPayload
>("createResident", async (payload: ResidentPayload) => {
  const { name, birthday, roomNumber, file } = payload;

  const form = new FormData();
  form.append("file", file);
  form.append("name", name);
  form.append("birthday", birthday.toISOString());
  form.append("roomNumber", roomNumber.toString());

  const response = await axiosInstance.post("/create-resident", form);
  return response.data;
});

export const deleteResident = createAsyncThunk(
  "deleteResident",
  async ({ id }: { id: number }, thunkAPI) => {
    const response = await axiosInstance.delete(`/resident/${id}`);
    return response.data;
  }
);
export const updateResident = createAsyncThunk(
  "upadteResident",
  async ({ id, file }: { id: number; file: any }, thunkAPI) => {
    const form = new FormData();
    form.append("file", file);
    const response = await axiosInstance.put(`/resident/icon/${id}`, form);
    return response;
  }
);

export const getCarePlan = createAsyncThunk<CarePlan, number>(
  "getCarePlan",
  async (residentId) => {
    try {
      const response = await axiosInstance.get<GetCarePlanResponse>(
        `/care-plan/${residentId}`
      );

      const carePlan = response.data.carePlan;

      if (carePlan === null || carePlan === undefined) {
        throw new Error("Care plan not found for the resident.");
      }

      return carePlan;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const editResident = createAsyncThunk<
  EditResidentResponse,
  EditResidentRequest
>("residents/editResident", async (requestData) => {
  const { residentId, ...data } = requestData;
  const response = await axiosInstance.put(
    `/edit-care-plan/${residentId}`,
    data
  );
  return response.data;
});

export const getCalenderPosts = createAsyncThunk<any, any>(
  "getCalenderPosts",
  async (searchData) => {
    try {
      const response = await axiosInstance.get(
        `/feed-messages/${searchData.residentId}?date=${searchData.date}`
      );

      if (response.data.data !== null && response.data.data.length > 0) {
        return response.data.data as FeedPostInterface[];
      } else {
        return response.data.data as FeedPostInterface[];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const getMessagesAsync = createAsyncThunk(
  "messages/getMessages",
  async (
    payload: { residentId: string | undefined; type: string },
    thunkAPI
  ) => {
    const { residentId, type } = payload;
    try {
      const response = await axiosInstance.get(
        `/feed-messages/${residentId}?type=${type}`
      );
      return { data: response.data, type };
    } catch (error) {
      throw error;
    }
  }
);

export const PostAsyncThunk = (name: string) => {
  return createAsyncThunk<
    CreateResidentResponse,
    { residentId: number; message: string; type: string }
  >(name, async ({ residentId, message, type }) => {
    const response = await axiosInstance.post(`/feed-message`, {
      message,
      type: type,
      resident_id: residentId,
    });
    return response.data;
  });
};

export const DeleteAsyncThunk = (name: string) => {
  return createAsyncThunk<string, DeleteMessageRequest>(
    name,
    async ({ messageId }) => {
      try {
        const response = await axiosInstance.delete(
          `/feed-message/${messageId}`
        );
        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete message.");
      }
    }
  );
};

export const UpdateAsyncThunk = (name: string) => {
  return createAsyncThunk<string, MessageData>(
    name,
    async ({ messageId, newMessage }) => {
      try {
        const response = await axiosInstance.put(`/feed-message/${messageId}`, {
          message: newMessage,
        });
        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update message.");
      }
    }
  );
};
