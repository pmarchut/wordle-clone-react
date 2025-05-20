import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";

export interface ToastProps {
  id: number;
  message: string;
  fade?: boolean;
}

interface ToastsState {
  toasts: ToastProps[];
  nextId: number; // Unikalny ID dla każdego toasta
}

const initialState: ToastsState = {
  toasts: [],
  nextId: 0,
};

const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<{ message: string }>) => {
      const id = state.nextId;
      state.toasts.push({ id, message: action.payload.message });
      state.nextId++;
    },
    fadeToast: (state, action: PayloadAction<number>) => {
      const toast = state.toasts.find((t) => t.id === action.payload);
      if (toast) {
        toast.fade = true;
      }
    },
    removeToast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, fadeToast, removeToast } = toastsSlice.actions;

// Thunk do pokazania toasta i automatycznego zamknięcia
export const showToast =
  (message: string, keep: boolean = false): AppThunk =>
  (dispatch, getState) => {
    const id = getState().toasts.nextId;

    dispatch(addToast({ message }));

    if (keep) return;

    setTimeout(() => {
      dispatch(fadeToast(id));
      setTimeout(() => dispatch(removeToast(id)), 300);
    }, 3000);
  };

export default toastsSlice.reducer;
