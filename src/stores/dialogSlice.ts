import { createSlice } from "@reduxjs/toolkit";

export interface DialogProps {
    type: "help Dialog" | "settings Dialog",
    id: string,
    heading: string,
}

const initialState = {
    dialog: {
        type: "help Dialog",
        id: "help-dialog",
        heading: "How to Play",
    } as DialogProps | null,
};

const dialogsSlice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    showHelpDialog(state) {
      state.dialog = {
        type: "help Dialog",
        id: "help-dialog",
        heading: "How to Play",
      };
    },
    showSettingsDialog(state) {
      state.dialog = {
        type: "settings Dialog",
        id: "settings-dialog",
        heading: "Settings",
      };
    },
    hideDialog(state) {
      state.dialog = null;
    }
  },
});
  
export const { showHelpDialog, showSettingsDialog, hideDialog } = dialogsSlice.actions;
export default dialogsSlice.reducer;
