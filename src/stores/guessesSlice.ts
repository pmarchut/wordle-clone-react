import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { showToast } from "./toastsSlice"; // zakładamy, że masz oddzielny slice do toastów

type GuessResult = "" | "correct" | "present" | "absent"; // lub dostosuj

export interface GuessesState {
  guesses: string[];
  checkResults: GuessResult[][];
  invalid: boolean;
  ended: boolean;
}

export const initialState: GuessesState = {
  guesses: ["", "", "", "", "", ""],
  checkResults: Array(6).fill(["", "", "", "", ""]) as GuessResult[][],
  invalid: false,
  ended: false,
};

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    enterLetter: (state, action: PayloadAction<string>) => {
      const index = getGuessIndex(state);
      if (index === -1) return;
      if (state.guesses[index].length < 5) {
        state.guesses[index] += action.payload;
      }
    },
    handleBackspace: (state) => {
      const index = getGuessIndex(state);
      if (index === -1) return;
      if (state.guesses[index].length > 0) {
        state.guesses[index] = state.guesses[index].slice(0, -1);
      }
    },
    setInvalid: (state, action: PayloadAction<boolean>) => {
      state.invalid = action.payload;
    },
  },
});

// Helper
function getGuessIndex(state: GuessesState): number {
  return state.checkResults.findIndex((row) => row.every((res) => res === ""));
}

function getCanBackspace(state: GuessesState): boolean {
  const guessIndex = getGuessIndex(state);

  return guessIndex !== -1 && state.guesses[guessIndex].length > 0;
}

function getCanSubmit(state: GuessesState): boolean {
  const guessIndex = getGuessIndex(state);

  if (guessIndex === -1) return false; // Jeśli nie ma dostępnego indeksu, nie można wysłać

  return state.guesses[guessIndex].length === 5;
}

// Publiczny selektor
export const selectGuessIndex = (state: RootState): number =>
  getGuessIndex(state.guesses);

export const selectCanBackspace = (state: RootState): boolean =>
  getCanBackspace(state.guesses);

export const selectCanSubmit = (state: RootState): boolean =>
  getCanSubmit(state.guesses);

// Thunk
export const handleEnter = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const guessesState = state.guesses;
  const index = getGuessIndex(guessesState);

  if (index === -1 || guessesState.guesses[index].length < 5) {
    dispatch(setInvalid(true));
    dispatch(showToast("Not enough letters"));

    // Usuwamy klasę invalid po 600ms
    setTimeout(() => {
      dispatch(setInvalid(false));
    }, 600);

    return;
  }

  // Tu można dodać dalszą logikę (sprawdzanie słowa, API, itd.)
};

export const { enterLetter, handleBackspace, setInvalid } = guessesSlice.actions;

export default guessesSlice.reducer;
