import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import dialogsReducer from "./dialogsSlice";
import guessesReducer from "./guessesSlice";
import toastsReducer from "./toastsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    dialogs: dialogsReducer,
    guesses: guessesReducer,
    toasts: toastsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
