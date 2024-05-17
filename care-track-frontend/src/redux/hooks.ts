/**
 * Custom React Redux hooks that provide type safety for the application's store.
 *
 * The `useAppDispatch` hook is a wrapper around `useDispatch` that ensures the
 * returned dispatch function is of type `AppDispatch`, which includes all the
 * action creators defined in the application's Redux store.
 *
 * The `useAppSelector` hook is a wrapper around `useSelector` that ensures the
 * returned state is of type `RootState`, which represents the complete state
 * of the application's Redux store.
 *
 * These hooks should be used throughout the application instead of the plain
 * `useDispatch` and `useSelector` hooks from `react-redux` to maintain type
 * safety and consistency.
 */
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
