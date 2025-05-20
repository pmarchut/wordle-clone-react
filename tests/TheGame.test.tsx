import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import guessesReducer from "../src/stores/guessesSlice";
import toastsReducer from "../src/stores/toastsSlice";
import TheGame from "@/components/TheGame";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'

// 📌 Funkcja pomocnicza
const factoryRender = () => {
    const store = configureStore({
        reducer: {
            guesses: guessesReducer,
            toasts: toastsReducer,
        },
    });
  
    return {
        ...render(
            <Provider store={store}>
                <TheGame />
            </Provider>
        ),
        store,
    };
};

describe("TheGame", () => {
    it("handles animation and backspace correctly", async () => {
        factoryRender();
    
        const user = userEvent.setup();
    
        // 🔹 Backspace powinien być zablokowany
        const backspaceButton = screen.getByTestId("backspace-button");
        expect(backspaceButton).toHaveAttribute("aria-disabled", "true");
    
        // 🔹 Klikamy literę "A"
        const letterButton = screen.getByTestId("key-a");
        await user.click(letterButton);
    
        // 🔹 Sprawdzamy tile
        const tile = screen.getAllByTestId("tile")[0];
        expect(tile).toHaveAttribute("data-animation", "pop");
        expect(tile).toHaveAttribute("aria-live", expect.not.stringMatching(/off/));
    
        // ✅ Kończymy animację
        act(() => {
            fireEvent.animationEnd(tile);
        });
    
        expect(tile).toHaveAttribute("data-animation", "idle");
        expect(tile).toHaveAttribute("aria-live", "off");
        expect(tile).toHaveTextContent("A");
    
        // 🔹 Backspace powinien być aktywny
        expect(backspaceButton).toHaveAttribute("aria-disabled", "false");
    
        // 🔹 Klikamy backspace
        await user.click(backspaceButton);
        expect(tile).toHaveTextContent("");
        expect(backspaceButton).toHaveAttribute("aria-disabled", "true");
    });

    it("enables enter when row is full", async () => {
        factoryRender();
    
        const user = userEvent.setup();
    
        const enterButton = screen.getByTestId("enter-button");
        expect(enterButton).toHaveAttribute("aria-disabled", "true");
    
        const letters = ["a", "b", "c", "d", "e"];
        for (const letter of letters) {
          await user.click(screen.getByTestId(`key-${letter}`));
        }
    
        expect(enterButton).toHaveAttribute("aria-disabled", "false");
    });
});
