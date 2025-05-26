import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWordList, initWord } from "@/services/wordService";
import { AppThunk } from "./store";

export interface WordsState {
  wordList: string[];
}

const initialState: WordsState = {
  wordList: [],
};

export const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    setWordList: (state, action: PayloadAction<string[]>) => {
      state.wordList = action.payload;
    },
  },
});

export const initWords = (): AppThunk => async (dispatch) => {
  const list = await fetchWordList();
  dispatch(setWordList(list));
  await initWord(list);
};

export const { setWordList } = wordsSlice.actions;

export default wordsSlice.reducer;
