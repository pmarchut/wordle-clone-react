import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "./store";
import { showToast } from "./toastsSlice";
import { checkGuess, getCachedWord, checkIfInWordList } from "@/services/wordService";
import { delay } from "../utils";

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
    setCheckResults: (state, action: PayloadAction<GuessResult[][]>) => {
      state.checkResults = action.payload;
    },
    setEnded: (state, action: PayloadAction<boolean>) => {
      state.ended = action.payload;
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

function getCorrectLetters(state: GuessesState): {
    [index: number]: string;
} {
  const letters: { [index: number]: string } = {}
  state.checkResults.forEach((results, guessIndex) => {
    results.forEach((result, letterIndex) => {
      if (result === 'correct') {
        letters[letterIndex] = state.guesses[guessIndex][letterIndex]
      }
    })
  })
  return letters
}

function getPresentLetters(state: GuessesState): string[] {
  const letters = new Set<string>()
  state.checkResults.forEach((results, guessIndex) => {
    results.forEach((result, letterIndex) => {
      if (result === 'present') {
        letters.add(state.guesses[guessIndex][letterIndex])
      }
    })
  })
  return Array.from(letters)
}

// Publiczny selektor
export const selectGuessIndex = (state: RootState): number =>
  getGuessIndex(state.guesses);

export const selectCanBackspace = (state: RootState): boolean =>
  getCanBackspace(state.guesses);

export const selectCanSubmit = (state: RootState): boolean =>
  getCanSubmit(state.guesses);

export const selectCorrectLetters = (state: RootState): {
    [index: number]: string;
} =>
  getCorrectLetters(state.guesses);

export const selectPresentLetters = (state: RootState): string[] =>
  getPresentLetters(state.guesses);

// Thunk
export const handleEnter = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const guessesState = state.guesses;
  const index = getGuessIndex(guessesState);
  const hardmode = localStorage.getItem('wordle-hardmode') === 'true';

  if (index === -1 || guessesState.guesses[index].length < 5) {
    dispatch(setInvalid(true));
    dispatch(showToast("Not enough letters"));

    // Usuwamy klasę invalid po 600ms
    setTimeout(() => {
      dispatch(setInvalid(false));
    }, 600);

    return;
  } else {
    const wordList = state.words.wordList;

    if (!checkIfInWordList(wordList, guessesState.guesses[index])) {
      dispatch(setInvalid(true));
      dispatch(showToast("Not in word list"));

      // Usuwamy klasę invalid po 600ms
      setTimeout(() => {
        dispatch(setInvalid(false));
      }, 600);

      return;
    }

    if (hardmode) {
      const currentGuess = guessesState.guesses[index]
      const correctLetters = getCorrectLetters(guessesState)
      const presentLetters = getPresentLetters(guessesState)
        
      // Sprawdzenie: każda litera oznaczona jako correct musi być w tej samej pozycji
      for (const index in correctLetters) {
        if (currentGuess[index] !== correctLetters[index]) {
          let indexText = '1st'
  
          switch (parseInt(index)) {
            case 0:
              indexText = '1st'
              break
            case 1:
              indexText = '2nd'
              break
            case 2:
              indexText = '3rd'
              break
            case 3:
              indexText = '4th'
              break
            case 4:
              indexText = '5th'
              break
          }
  
          dispatch(setInvalid(true));
          dispatch(showToast(`${indexText} letter must be ${correctLetters[index]}`));

          // Usuwamy klasę invalid po 600ms
          setTimeout(() => {
            dispatch(setInvalid(false));
          }, 600);

          return;
        }
      }
        
      // Sprawdzenie: każda litera oznaczona jako present musi być zawarta gdziekolwiek w guess
      for (const letter of presentLetters) {
        if (!currentGuess.includes(letter)) {
          dispatch(setInvalid(true));
          dispatch(showToast(`Guess must contain ${letter}`));

          // Usuwamy klasę invalid po 600ms
          setTimeout(() => {
            dispatch(setInvalid(false));
          }, 600);

          return;
        }
      }
    }

    const result = checkGuess(guessesState.guesses[index]);

    // Weź aktualny rząd i stwórz jego kopię
    const rowResult = [...guessesState.checkResults[index]];

    for (let i = 0; i < result.length; i++) {
      // Zaktualizuj jedną literę w lokalnej kopii
      rowResult[i] = result[i];

      // Zaktualizuj tylko jeden rząd w całym checkResults
      dispatch(setCheckResults(
        guessesState.checkResults.map((row, rowIndex) => {
          if (rowIndex === index) {
            return [...rowResult]; // aktualizowana wersja
          }
          return row;
        })
      ));

      await delay(400); // animacja - 400ms odstępu
    }

    if (result.every((check) => check === 'correct')) {
      dispatch(showToast("Splendid!"));
      dispatch(setEnded(true)); // Ustawiamy flagę ended na true
    } else if (index === 5) {
      dispatch(showToast(getCachedWord() as string, true));
      dispatch(setEnded(true)); // Ustawiamy flagę ended na true
    }
  }
};

export const { enterLetter, handleBackspace, setInvalid, setCheckResults, setEnded } = guessesSlice.actions;

export default guessesSlice.reducer;
