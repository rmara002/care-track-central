/**
 * Configures and returns the Redux store for the application.
 * The store includes the following slices:
 * - `residents`: Manages the state of residents
 * - `carePlan`: Manages the state of care plans
 * - `feedPostsSlice`: Manages the state of posts related to resident
 * - `user`: Manages the state of the current user
 * - `staffmembers`: Manages the state of staff members
 *
 * The store also persists the state to local storage and rehydrates it on app startup.
 */
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import residentSlice from "./features/residentSlice";
import carePlanSlice from "./features/carePlanSlice";
import userSlice from "./features/userSlice";
import staffSlice from "./features/staffSlice";
import feedPostsSlice from "./features/feedPostsSlice";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("persistedRoot");
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    return parsedState;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("persistedRoot", serializedState);
  } catch {
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    residents: residentSlice,
    carePlan: carePlanSlice,
    feedPosts: feedPostsSlice,
    user: userSlice,
    staffmembers: staffSlice,
  },
  preloadedState: preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
