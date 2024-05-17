/**
 * Manages the state of the care plan in the Redux store.
 *
 * This slice handles the state for fetching, searching, and editing care plans.
 * It provides reducers for handling the pending, fulfilled, and rejected states
 * of the corresponding async thunk actions.
 */
import { CarePlan } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import { editResident, getCarePlan } from "./AsyncThunk";
interface CarePlanState {
  carePlan: CarePlan | null;
  loading: boolean;
  error: string | null;
}
const initialState: CarePlanState = {
  carePlan: null,
  loading: false,
  error: null,
};

export const carePlanSlice = createSlice({
  name: "carePlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCarePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.carePlan = action.payload;
      })
      .addCase(getCarePlan.rejected, (state) => {
        state.loading = false;
      })

      .addCase(editResident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editResident.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editResident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});
export default carePlanSlice.reducer;
