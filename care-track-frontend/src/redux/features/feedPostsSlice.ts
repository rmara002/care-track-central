/**
 * Manages the state of feed posts in the Redux store.
 *
 * The `feedPostsSlice` handles the state for various types of feed posts, such as personal hygiene, personal care, weight, oxygen saturation, pulse rate, temperature, blood sugar, bowel movement, body map, fluid intake, food intake, and incident/accident posts. It also manages the state for search feed posts.
 *
 * The slice uses the `createSlice` function from the `@reduxjs/toolkit` library to define the initial state, reducers, and extra reducers. The extra reducers handle the asynchronous actions `getMessagesAsync` and `getCalenderPosts`, which fetch the data for the different types of feed posts.
 *
 * The `initialState` object defines the initial state of the slice, with properties for each type of feed post, as well as loading and error states.
 *
 * The `feedPostsSlice` is exported as the default export of this module.
 */

import { ResidentState } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import { getMessagesAsync, getCalenderPosts } from "./AsyncThunk";
import postCategoriesData from "./PostCategoriesData";

export const initialState: ResidentState = {
  personalHygienePosts: [],
  personalCarePosts: [],
  weightPosts: [],
  oxygenSaturationPosts: [],
  pulseRatePosts: [],
  temperaturePosts: [],
  bloodSugarPosts: [],
  bowelMovementPosts: [],
  bodyMapPosts: [],
  fluidIntakePosts: [],
  foodIntakePosts: [],
  incidentAccidentPosts: [],
  searchFeedPosts: [],
  loading: false,
  error: null,
};

export const feedPostsSlice = createSlice({
  name: "feedPostsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const matchedState = postCategoriesData.find(
          (item) => item.id === action.payload.type
        );
        if (matchedState) {
          state[matchedState.value as keyof ResidentState] = action.payload.data
            ?.data as ResidentState[keyof ResidentState];
          (state as any)[matchedState.value] = action.payload.data?.data;
        }
      })
      .addCase(getMessagesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch personal care hygiene data.";
      })
      .addCase(getCalenderPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalenderPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.searchFeedPosts = action.payload;
      })
      .addCase(getCalenderPosts.rejected, (state) => {
        state.loading = false;
      });
  },
});
export default feedPostsSlice.reducer;
