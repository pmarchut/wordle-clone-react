import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import guessesReducer, { GuessesState, initialState as guessesInitialState } from "@/stores/guessesSlice";
import GameBoard from "@/components/GameBoard";
import '@testing-library/jest-dom'

// 📌 Funkcja pomocnicza
const factoryRender = (guesses: string[] = ["", "", "", "", "", ""]) => {
    const store = configureStore({
      reducer: {
        guesses: guessesReducer,
      },
      preloadedState: {
        guesses: {
          ...guessesInitialState,
          guesses: guesses,
        } as GuessesState,
      }
    });
  
    return {
      ...render(
        <Provider store={store}>
          <GameBoard />
        </Provider>
      ),
      store,
    };
};

describe("GameBoard", () => {
  it("renders the correct number of rows and passes words to them", () => {
    factoryRender(["HELLO", "WORLD", "", "", "", ""]);

    // 🔹 Zakładamy, że każdy AppRow ma data-testid="row-<index>"
    const rows = screen.getAllByTestId(/Row/);

    expect(rows).toHaveLength(6);

    expect(screen.getByTestId("Row 1")).toHaveTextContent("HELLO");
    expect(screen.getByTestId("Row 2")).toHaveTextContent("WORLD");
  });
});
