/**
 * The Redux slice for managing the state of residents in the application.
 *
 * This slice handles the state for fetching, creating, and deleting residents, including
 * tracking the loading state and any error messages.
 *
 * The initial state includes an array of `Resident` objects, a `loading` flag, and
 * `error` and `message` properties to store any error or success messages.
 *
 * The slice uses the `createSlice` function from `@reduxjs/toolkit` to define the
 * reducer logic, which is triggered by the corresponding async thunk actions
 * (`fetchResidents`, `createResident`, `deleteResident`).
 */
import { Resident } from "@/lib/types";
import { createResident, deleteResident, fetchResidents } from "./AsyncThunk";
import { createSlice } from "@reduxjs/toolkit";

interface ResidentsState {
  residents: Resident[];
  loading: boolean;
  message: string | null;
  error: string | null;
}
const initialState: ResidentsState = {
  residents: [],
  loading: false,
  error: null,
  message: "",
};
export const residentsSlice = createSlice({
  name: "residents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResidents.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.residents = action.payload.residents;
      })
      .addCase(fetchResidents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });
    /**
     * Handles the pending state for the `createResident` action.
     * Sets the `loading` state to `true` and clears any existing `error`.
     * @param state - The current state of the `residentsSlice`.
     */
    builder
      .addCase(createResident.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResident.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createResident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });
    builder
      .addCase(deleteResident.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(deleteResident.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          message: action.payload.message,
          error: null,
        };
      })
      .addCase(deleteResident.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error.message ?? "An error occurred",
        };
      });
  },
});
export default residentsSlice.reducer;
