/**
 * Manages the state of staff members in the application.
 *
 * This slice handles the state for fetching, deleting, and updating the unread messages status for staff members.
 *
 * @module staffSlice
 */
import { StaffMember } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import { deleteStaffMember, fetchStaffMembers } from "./AsyncThunk";

export interface StaffState {
  staffMembers: StaffMember[];
  loading: boolean;
  error: string | null;
  unreadMsgs: boolean;
}

const initialState: StaffState = {
  staffMembers: [],
  loading: false,
  unreadMsgs: false,
  error: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    updateUnreadMsgs(state, action) {
      return {
        ...state,
        unreadMsgs: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffMembers.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.staffMembers = action.payload;
      })
      .addCase(fetchStaffMembers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch staff members.";
      });
    builder
      .addCase(deleteStaffMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaffMember.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteStaffMember.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to delete staff members.";
      });
  },
});

export const { updateUnreadMsgs } = staffSlice.actions;
export default staffSlice.reducer;
