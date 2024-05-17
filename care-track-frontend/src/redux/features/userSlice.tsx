/**
 * Manages the state of the user in the Redux store.
 *
 * This slice handles the state for user-related actions, including logging in and updating the user's profile.
 *
 * The initial state includes the current user, the status of the current operation, and any error messages.
 *
 * The slice uses the `loginUser` and `updateProfile` async thunks to handle the asynchronous actions, updating the state accordingly.
 */
import { LoginUser } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  UpdatePasswordAction,
  loginUser,
  registerUser,
  updateProfile,
} from "./AsyncThunk";
export interface UserState {
  user: LoginUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};
export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(UpdatePasswordAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdatePasswordAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UpdatePasswordAction.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Profile Updated Successfully");
        state.user.fullname = action.payload.user.fullname;
        state.user.icon = action.payload.user.icon;
      })
      .addCase(updateProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});
export {};
export default userSlice.reducer;
