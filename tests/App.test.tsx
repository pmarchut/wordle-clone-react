import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dialogsReducer, { DialogProps } from "../src/stores/dialogsSlice";
import guessesReducer from "../src/stores/guessesSlice";
import toastsReducer from "../src/stores/toastsSlice";
import wordsReducer from "../src/stores/wordsSlice";
import userEvent from "@testing-library/user-event";
import App from '../src/App';
import * as wordServiceModule from "@/services/wordService";

jest.mock("@/services/wordService", () => ({
  ...jest.requireActual("@/services/wordService"),
  checkGuess: jest.fn(),
  fetchWordList: jest.fn(),
  initWord: jest.fn(),
  getCachedWord: jest.fn(),
}));

const { checkGuess, fetchWordList, getCachedWord } = wordServiceModule;

// 📌 Funkcja pomocnicza
const factoryRender = (dialogState: DialogProps | null = null) => {
  const store = configureStore({
    reducer: {
      dialogs: dialogsReducer,
      guesses: guessesReducer,
      toasts: toastsReducer,
      words: wordsReducer,
    },
    preloadedState: {
      dialogs: {
        dialog: dialogState,
      },
    }
  });

  return {
    ...render(
      <Provider store={store}>
        <App />
      </Provider>
    ),
    store,
  };
};

const pressKey = async (key: string, user: ReturnType<typeof userEvent.setup>, container: HTMLElement) => {
  const button = container.querySelector(`[data-key="${key}"]`);
  await user.click(button!);
};

const enterWord = async (word: string, user: ReturnType<typeof userEvent.setup>, container: HTMLElement) => {
  for (const letter of word.toLowerCase()) {
    await pressKey(letter, user, container);
  }
  await pressKey("↵", user, container);
};

const waitForNextLetter = async () => {
  // Załóżmy, że masz jakiś delay animacji, np. 400ms
  act(() => {
    jest.advanceTimersByTime(400);
  });
  await act(() => Promise.resolve()); // lub waitFor, jeśli lepiej się sprawdza
};

const getRowTiles = (rowNumber: number) => {
  return screen.getByLabelText(`Row ${rowNumber}`).querySelectorAll('[data-testid="tile"]');
};

describe("App", () => {
  beforeEach(() => {
    (checkGuess as jest.Mock).mockImplementation((guess: string) => {
      const guessLetters = guess.toUpperCase().split('');
      const targetLetters = 'HAZEL'.split('');
      const result: Array<'correct' | 'present' | 'absent'> = Array(5).fill('absent');

      const used = Array(5).fill(false);
      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          result[i] = 'correct';
          used[i] = true;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (result[i] !== 'correct') {
          const idx = targetLetters.findIndex((l, j) => l === guessLetters[i] && !used[j]);
          if (idx !== -1) {
            result[i] = 'present';
            used[idx] = true;
          }
        }
      }

      return result;
    });

    (fetchWordList as jest.Mock).mockImplementation(() => {
      return Promise.resolve([
        "audio", "raven", "lapse", "hazel", "javel", "camel", "label", "belts", "psych"
      ]);
    });

    (getCachedWord as jest.Mock).mockImplementation(() => {
      return "HAZEL";
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("adds 'dark' class to body if wordle-darkmode is true", () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === "wordle-darkmode") {
        return "true";
      }
      return null;
    });
    document.body.className = ""; // reset klas na body
    factoryRender();
    expect(document.body.classList.contains("dark")).toBe(true);
  });

  it("does not add 'dark' class if wordle-darkmode is false", () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === "wordle-darkmode") {
        return "false";
      }
      return null;
    });
    document.body.className = ""; // reset klas na body
    factoryRender();
    expect(document.body.classList.contains("dark")).toBe(false);
  });

  it("adds 'colorblind' class to body if wordle-colorblind is true", () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === "wordle-colorblind") {
        return "true";
      }
      return null;
    });
    document.body.className = ""; // reset klas na body
    factoryRender();
    expect(document.body.classList.contains("colorblind")).toBe(true);
  });

  it("does not add 'colorblind' class if wordle-colorblind is false", () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === "wordle-colorblind") {
        return "false";
      }
      return null;
    });
    document.body.className = ""; // reset klas na body
    factoryRender();
    expect(document.body.classList.contains("colorblind")).toBe(false);
  });

  it('shows the "How to Play" dialog on initial load and hides the dialog when clicking outside of it', async () => {
    factoryRender({
      type: "help Dialog",
      id: "help-dialog",
      heading: "How to Play",
    });

    // 🔎 Szukamy elementu modala
    const overlay = screen.getByTestId("modal-overlay");
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("aria-label", "help Dialog");

    // Sprawdzamy heading i komponent
    expect(screen.getByTestId("modal-heading")).toHaveClass("newHeading");
    expect(screen.getByText("How to Play")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toHaveClass("extraPadding");

    // Komponent AppHelp powinien być wyrenderowany (upewnij się, że ma data-testid albo tekst)
    expect(screen.getByTestId("app-help")).toBeInTheDocument();

    // 🔥 Klikamy overlay (poza modalem)
    fireEvent.click(overlay);

    // Po kliknięciu powinno zniknąć
    expect(screen.queryByTestId("modal-overlay")).toBeNull();
  });

  it('shows the "How to Play" dialog on initial load and hides the dialog when clicking on close button', async () => {
    factoryRender({
      type: "help Dialog",
      id: "help-dialog",
      heading: "How to Play",
    });
  
    // 🔍 Znajdź overlay (modal)
    const overlay = screen.getByTestId("modal-overlay");
    expect(overlay).toBeInTheDocument();
  
    // 🔍 Znajdź przycisk zamknięcia (np. aria-label="Close")
    const closeButton = screen.getByLabelText("Close");
    expect(closeButton).toBeInTheDocument();
  
    // 🔥 Kliknij przycisk zamykania
    fireEvent.click(closeButton);
  
    // 🎯 Modal powinien zniknąć
    expect(screen.queryByTestId("modal-overlay")).toBeNull();
  });

  it('opens "How to Play" dialog and closes dropdown', async () => {
    factoryRender(); // renderuje komponent, np. App lub komponent nadrzędny
  
    const helpButton = screen.getByTestId("help-button");
  
    // 🔍 Modal nie powinien być widoczny na początku
    expect(screen.queryByTestId("modal-overlay")).toBeNull();
  
    // 🔥 Klikamy przycisk, który otwiera dropdown
    fireEvent.click(helpButton);
  
    // 🔍 Szukamy pozycji listy
    const listItems = await screen.findAllByRole("menuitem");
  
    // 🔥 Klikamy pierwszy element — np. "How to Play"
    fireEvent.click(listItems[0]);
  
    // ✅ Modal powinien się pojawić
    const dialog = await screen.findByTestId("modal-overlay");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-label", "help Dialog");
  
    // ✅ Heading powinien zawierać tekst
    expect(screen.getByText("How to Play")).toBeInTheDocument();
  
    // ✅ Komponent AppHelp (np. po `data-testid`)
    expect(screen.getByTestId("app-help")).toBeInTheDocument();
  
    // ❌ Dropdown powinien zniknąć
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it('opens "Settings" dialog', async () => {
    factoryRender();
  
    const settingsButton = screen.getByTestId("settings-button");
  
    // ⛔ dialog nie powinien być widoczny
    expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
  
    // ✅ kliknij przycisk
    fireEvent.click(settingsButton);
  
    // ✅ dialog powinien się pojawić
    const dialog = await screen.findByTestId("modal-overlay");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-label", "settings Dialog");
  
    // ✅ zawiera nagłówek z tekstem "Settings"
    expect(screen.getByTestId("modal-heading")).toHaveTextContent("Settings");
  
    // ✅ nie ma klasy "extraPadding" na zawartości
    expect(screen.getByTestId("modal-content")).not.toHaveClass("extraPadding");
  
    // ✅ nie ma klasy "newHeading" na nagłówku
    expect(screen.getByTestId("modal-heading")).not.toHaveClass("newHeading");
  
    // ✅ komponent AppSettings powinien być w dialogu
    // Jeżeli AppSettings renderuje np. jakiś nagłówek lub tekst, to sprawdzamy jego obecność
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('shows animation and toast when not enough letters', async () => {
    jest.useFakeTimers(); // ⏱️ Włącz fake timery
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime }); // ⏱️ zsynchronizowane timery
  
    const { container } = factoryRender();
    const enterButton = container.querySelector('[data-key="↵"]');
    await user.click(enterButton!);
  
    const row = screen.getByLabelText("Row 1");
    expect(row).toHaveClass("invalid");
  
    let toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("Not enough letters");
  
    // 🔄 Upływ czasu
    act(() => {
      jest.runAllTimers(); // uruchamia setTimeout
    });
  
    await waitFor(() => {
      expect(row).not.toHaveClass("invalid");
      expect(container.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });
  
    // 🔥 ponownie klikamy
    await user.click(enterButton!);
  
    expect(row).toHaveClass("invalid");
    toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("Not enough letters");
  
    act(() => {
      jest.runAllTimers();
    });
  
    await waitFor(() => {
      expect(row).not.toHaveClass("invalid");
      expect(container.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });
  });

  it("guesses the word HAZEL with some correct and some wrong letters", async () => {
    jest.useFakeTimers(); // ⏱️ Włącz fake timery
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { container } = factoryRender();

    await enterWord("AUDIO", user, container);

    const row1 = getRowTiles(1);

    await waitFor(() => expect(row1[0]).toHaveAttribute("data-state", "present"));
    expect(row1[0]).toHaveAttribute("data-animation", "flip-in");
    fireEvent.animationEnd(row1[0]);
    expect(row1[0]).toHaveAttribute("data-animation", "flip-out");
    fireEvent.animationEnd(row1[0]);
    expect(row1[0]).toHaveAttribute("data-animation", "idle");
    expect(row1[0]).toHaveAttribute("aria-label", "1st letter, A, present");

    await waitForNextLetter();

    expect(row1[1]).toHaveAttribute("data-state", "absent");
    expect(row1[1]).toHaveAttribute("data-animation", "flip-in");
    fireEvent.animationEnd(row1[1]);
    expect(row1[1]).toHaveAttribute("data-animation", "flip-out");
    fireEvent.animationEnd(row1[1]);
    expect(row1[1]).toHaveAttribute("data-animation", "idle");
    expect(row1[1]).toHaveAttribute("aria-label", "2nd letter, U, absent");

    await waitForNextLetter();

    expect(row1[2]).toHaveAttribute("data-state", "absent");
    expect(row1[2]).toHaveAttribute("data-animation", "flip-in");
    fireEvent.animationEnd(row1[2]);
    expect(row1[2]).toHaveAttribute("data-animation", "flip-out");
    fireEvent.animationEnd(row1[2]);
    expect(row1[2]).toHaveAttribute("data-animation", "idle");
    expect(row1[2]).toHaveAttribute("aria-label", "3rd letter, D, absent");

    await waitForNextLetter();

    expect(row1[3]).toHaveAttribute("data-state", "absent");
    expect(row1[3]).toHaveAttribute("data-animation", "flip-in");
    fireEvent.animationEnd(row1[3]);
    expect(row1[3]).toHaveAttribute("data-animation", "flip-out");
    fireEvent.animationEnd(row1[3]);
    expect(row1[3]).toHaveAttribute("data-animation", "idle");
    expect(row1[3]).toHaveAttribute("aria-label", "4th letter, I, absent");

    await waitForNextLetter();

    expect(row1[4]).toHaveAttribute("data-state", "absent");
    expect(row1[4]).toHaveAttribute("data-animation", "flip-in");
    fireEvent.animationEnd(row1[4]);
    expect(row1[4]).toHaveAttribute("data-animation", "flip-out");
    fireEvent.animationEnd(row1[4]);
    expect(row1[4]).toHaveAttribute("data-animation", "idle");
    expect(row1[4]).toHaveAttribute("aria-label", "5th letter, O, absent");

    expect(screen.getByLabelText("a present")).toHaveAttribute("data-state", "present");
    expect(screen.getByLabelText("u absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("d absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("i absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("o absent")).toHaveAttribute("data-state", "absent");

    await enterWord("RAVEN", user, container);
    const row2 = getRowTiles(2);

    await waitFor(() => expect(row2[0]).toHaveAttribute("data-state", "absent"));
    expect(row2[0]).toHaveAttribute("aria-label", "1st letter, R, absent");

    await waitForNextLetter();

    expect(row2[1]).toHaveAttribute("data-state", "correct");
    expect(row2[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row2[2]).toHaveAttribute("data-state", "absent");
    expect(row2[2]).toHaveAttribute("aria-label", "3rd letter, V, absent");

    await waitForNextLetter();

    expect(row2[3]).toHaveAttribute("data-state", "correct");
    expect(row2[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row2[4]).toHaveAttribute("data-state", "absent");
    expect(row2[4]).toHaveAttribute("aria-label", "5th letter, N, absent");

    expect(screen.getByLabelText("r absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("v absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("n absent")).toHaveAttribute("data-state", "absent");

    await enterWord("LAPSE", user, container);
    const row3 = getRowTiles(3);

    await waitFor(() => expect(row3[0]).toHaveAttribute("data-state", "present"));
    expect(row3[0]).toHaveAttribute("aria-label", "1st letter, L, present");

    await waitForNextLetter();

    expect(row3[1]).toHaveAttribute("data-state", "correct");
    expect(row3[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row3[2]).toHaveAttribute("data-state", "absent");
    expect(row3[2]).toHaveAttribute("aria-label", "3rd letter, P, absent");

    await waitForNextLetter();

    expect(row3[3]).toHaveAttribute("data-state", "absent");
    expect(row3[3]).toHaveAttribute("aria-label", "4th letter, S, absent");

    await waitForNextLetter();

    expect(row3[4]).toHaveAttribute("data-state", "present");
    expect(row3[4]).toHaveAttribute("aria-label", "5th letter, E, present");

    expect(screen.getByLabelText("l present")).toHaveAttribute("data-state", "present");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("p absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("s absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");

    await enterWord("HAZEL", user, container);
    const row4 = getRowTiles(4);

    await waitFor(() => expect(row4[0]).toHaveAttribute("data-state", "correct"));
    expect(row4[0]).toHaveAttribute("aria-label", "1st letter, H, correct");

    await waitForNextLetter();

    expect(row4[1]).toHaveAttribute("data-state", "correct");
    expect(row4[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row4[2]).toHaveAttribute("data-state", "correct");
    expect(row4[2]).toHaveAttribute("aria-label", "3rd letter, Z, correct");

    await waitForNextLetter();

    expect(row4[3]).toHaveAttribute("data-state", "correct");
    expect(row4[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row4[4]).toHaveAttribute("data-state", "correct");
    expect(row4[4]).toHaveAttribute("aria-label", "5th letter, L, correct");

    await waitForNextLetter();

    expect(screen.getByLabelText("h correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("z correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("l correct")).toHaveAttribute("data-state", "correct");

    let toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("Splendid!");

    act(() => {
      jest.runAllTimers();
    });

    toast = container.querySelector("#gameToaster");

    await waitFor(() => {
      expect(toast?.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });

    await pressKey("a", user, container);
    fireEvent.keyDown(window, { key: "a" });

    const allTiles = screen.getAllByTestId("tile");
    const filled = Array.from(allTiles).filter((tile) => tile.textContent?.trim());
    expect(filled).toHaveLength(20);

    expect(container.querySelector("[data-key=\"↵\"]")).toHaveAttribute("aria-disabled", "true");
  });

  it("doesn't guess the word HAZEL in 6 tries", async () => {
    jest.useFakeTimers(); // ⏱️ Włącz fake timery
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { container } = factoryRender();

    await enterWord("AUDIO", user, container);

    const row1 = getRowTiles(1);

    await waitFor(() => expect(row1[0]).toHaveAttribute("data-state", "present"));
    expect(row1[0]).toHaveAttribute("aria-label", "1st letter, A, present");

    await waitForNextLetter();

    expect(row1[1]).toHaveAttribute("data-state", "absent");
    expect(row1[1]).toHaveAttribute("aria-label", "2nd letter, U, absent");

    await waitForNextLetter();

    expect(row1[2]).toHaveAttribute("data-state", "absent");
    expect(row1[2]).toHaveAttribute("aria-label", "3rd letter, D, absent");

    await waitForNextLetter();

    expect(row1[3]).toHaveAttribute("data-state", "absent");
    expect(row1[3]).toHaveAttribute("aria-label", "4th letter, I, absent");

    await waitForNextLetter();

    expect(row1[4]).toHaveAttribute("data-state", "absent");
    expect(row1[4]).toHaveAttribute("aria-label", "5th letter, O, absent");

    expect(screen.getByLabelText("a present")).toHaveAttribute("data-state", "present");
    expect(screen.getByLabelText("u absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("d absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("i absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("o absent")).toHaveAttribute("data-state", "absent");

    await enterWord("RAVEN", user, container);

    const row2 = getRowTiles(2);

    await waitFor(() => expect(row2[0]).toHaveAttribute("data-state", "absent"));
    expect(row2[0]).toHaveAttribute("aria-label", "1st letter, R, absent");

    await waitForNextLetter();

    expect(row2[1]).toHaveAttribute("data-state", "correct");
    expect(row2[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row2[2]).toHaveAttribute("data-state", "absent");
    expect(row2[2]).toHaveAttribute("aria-label", "3rd letter, V, absent");

    await waitForNextLetter();

    expect(row2[3]).toHaveAttribute("data-state", "correct");
    expect(row2[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row2[4]).toHaveAttribute("data-state", "absent");
    expect(row2[4]).toHaveAttribute("aria-label", "5th letter, N, absent");

    expect(screen.getByLabelText("r absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("v absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("n absent")).toHaveAttribute("data-state", "absent");

    await enterWord("LAPSE", user, container);
    const row3 = getRowTiles(3);

    await waitFor(() => expect(row3[0]).toHaveAttribute("data-state", "present"));
    expect(row3[0]).toHaveAttribute("aria-label", "1st letter, L, present");

    await waitForNextLetter();

    expect(row3[1]).toHaveAttribute("data-state", "correct");
    expect(row3[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row3[2]).toHaveAttribute("data-state", "absent");
    expect(row3[2]).toHaveAttribute("aria-label", "3rd letter, P, absent");

    await waitForNextLetter();

    expect(row3[3]).toHaveAttribute("data-state", "absent");
    expect(row3[3]).toHaveAttribute("aria-label", "4th letter, S, absent");

    await waitForNextLetter();

    expect(row3[4]).toHaveAttribute("data-state", "present");
    expect(row3[4]).toHaveAttribute("aria-label", "5th letter, E, present");

    expect(screen.getByLabelText("l present")).toHaveAttribute("data-state", "present");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("p absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("s absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");

    await enterWord("JAVEL", user, container);
    const row4 = getRowTiles(4);

    await waitFor(() => expect(row4[0]).toHaveAttribute("data-state", "absent"));
    expect(row4[0]).toHaveAttribute("aria-label", "1st letter, J, absent");

    await waitForNextLetter();

    expect(row4[1]).toHaveAttribute("data-state", "correct");
    expect(row4[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row4[2]).toHaveAttribute("data-state", "absent");
    expect(row4[2]).toHaveAttribute("aria-label", "3rd letter, V, absent");

    await waitForNextLetter();

    expect(row4[3]).toHaveAttribute("data-state", "correct");
    expect(row4[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row4[4]).toHaveAttribute("data-state", "correct");
    expect(row4[4]).toHaveAttribute("aria-label", "5th letter, L, correct");

    expect(screen.getByLabelText("j absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("v absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("l correct")).toHaveAttribute("data-state", "correct");

    await enterWord("CAMEL", user, container);
    const row5 = getRowTiles(5);

    await waitFor(() => expect(row5[0]).toHaveAttribute("data-state", "absent"));
    expect(row5[0]).toHaveAttribute("aria-label", "1st letter, C, absent");

    await waitForNextLetter();

    expect(row5[1]).toHaveAttribute("data-state", "correct");
    expect(row5[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row5[2]).toHaveAttribute("data-state", "absent");
    expect(row5[2]).toHaveAttribute("aria-label", "3rd letter, M, absent");

    await waitForNextLetter();

    expect(row5[3]).toHaveAttribute("data-state", "correct");
    expect(row5[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row5[4]).toHaveAttribute("data-state", "correct");
    expect(row5[4]).toHaveAttribute("aria-label", "5th letter, L, correct");

    expect(screen.getByLabelText("c absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("m absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("l correct")).toHaveAttribute("data-state", "correct");

    await enterWord("LABEL", user, container);
    const row6 = getRowTiles(6);

    await waitFor(() => expect(row6[0]).toHaveAttribute("data-state", "absent"));
    expect(row6[0]).toHaveAttribute("aria-label", "1st letter, L, absent");

    await waitForNextLetter();

    expect(row6[1]).toHaveAttribute("data-state", "correct");
    expect(row6[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row6[2]).toHaveAttribute("data-state", "absent");
    expect(row6[2]).toHaveAttribute("aria-label", "3rd letter, B, absent");

    await waitForNextLetter();

    expect(row6[3]).toHaveAttribute("data-state", "correct");
    expect(row6[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row6[4]).toHaveAttribute("data-state", "correct");
    expect(row6[4]).toHaveAttribute("aria-label", "5th letter, L, correct");

    await waitForNextLetter();

    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("b absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("l correct")).toHaveAttribute("data-state", "correct");

    let toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("HAZEL");

    act(() => {
      jest.runAllTimers();
    });

    toast = container.querySelector("#gameToaster");

    await waitFor(() => {
      expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("HAZEL");
    });

    expect(container.querySelector("[data-key=\"↵\"]")).toHaveAttribute("aria-disabled", "true");
  });

  it("shows hardmode toasts and sets row invalid", async () => {
    localStorage.setItem('wordle-hardmode', 'true');
    jest.useFakeTimers(); // ⏱️ Włącz fake timery
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { container } = factoryRender();

    await enterWord("AUDIO", user, container);

    const row1 = getRowTiles(1);

    await waitFor(() => expect(row1[0]).toHaveAttribute("data-state", "present"));
    expect(row1[0]).toHaveAttribute("aria-label", "1st letter, A, present");

    await waitForNextLetter();

    expect(row1[1]).toHaveAttribute("data-state", "absent");
    expect(row1[1]).toHaveAttribute("aria-label", "2nd letter, U, absent");

    await waitForNextLetter();

    expect(row1[2]).toHaveAttribute("data-state", "absent");
    expect(row1[2]).toHaveAttribute("aria-label", "3rd letter, D, absent");

    await waitForNextLetter();

    expect(row1[3]).toHaveAttribute("data-state", "absent");
    expect(row1[3]).toHaveAttribute("aria-label", "4th letter, I, absent");

    await waitForNextLetter();

    expect(row1[4]).toHaveAttribute("data-state", "absent");
    expect(row1[4]).toHaveAttribute("aria-label", "5th letter, O, absent");

    expect(screen.getByLabelText("a present")).toHaveAttribute("data-state", "present");
    expect(screen.getByLabelText("u absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("d absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("i absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("o absent")).toHaveAttribute("data-state", "absent");

    await enterWord("BELTS", user, container);

    expect(screen.getByLabelText("Row 2")).toHaveClass("invalid");

    let toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("Guess must contain A");

    act(() => {
      jest.runAllTimers();
    });

    toast = container.querySelector("#gameToaster");

    await waitFor(() => {
      expect(toast?.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });

    await pressKey("←", user, container);
    await pressKey("←", user, container);
    await pressKey("←", user, container);
    await pressKey("←", user, container);
    await pressKey("←", user, container);

    await enterWord("RAVEN", user, container);

    const row2 = getRowTiles(2);

    await waitFor(() => expect(row2[0]).toHaveAttribute("data-state", "absent"));
    expect(row2[0]).toHaveAttribute("aria-label", "1st letter, R, absent");

    await waitForNextLetter();

    expect(row2[1]).toHaveAttribute("data-state", "correct");
    expect(row2[1]).toHaveAttribute("aria-label", "2nd letter, A, correct");

    await waitForNextLetter();

    expect(row2[2]).toHaveAttribute("data-state", "absent");
    expect(row2[2]).toHaveAttribute("aria-label", "3rd letter, V, absent");

    await waitForNextLetter();

    expect(row2[3]).toHaveAttribute("data-state", "correct");
    expect(row2[3]).toHaveAttribute("aria-label", "4th letter, E, correct");

    await waitForNextLetter();

    expect(row2[4]).toHaveAttribute("data-state", "absent");
    expect(row2[4]).toHaveAttribute("aria-label", "5th letter, N, absent");

    expect(screen.getByLabelText("r absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("a correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("v absent")).toHaveAttribute("data-state", "absent");
    expect(screen.getByLabelText("e correct")).toHaveAttribute("data-state", "correct");
    expect(screen.getByLabelText("n absent")).toHaveAttribute("data-state", "absent");

    await enterWord("PSYCH", user, container);

    expect(screen.getByLabelText("Row 3")).toHaveClass("invalid");

    toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("2nd letter must be A");

    act(() => {
      jest.runAllTimers();
    });

    toast = container.querySelector("#gameToaster");

    await waitFor(() => {
      expect(toast?.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });
  });

  it("shows Not in word list toast and sets row invalid", async () => {
    jest.useFakeTimers(); // ⏱️ Włącz fake timery
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { container } = factoryRender();

    await enterWord("AAAAA", user, container);

    expect(screen.getByLabelText("Row 1")).toHaveClass("invalid");

    let toast = container.querySelector("#gameToaster");
    expect(toast?.querySelector('[aria-live="polite"]')).toHaveTextContent("Not in word list");

    act(() => {
      jest.runAllTimers();
    });

    toast = container.querySelector("#gameToaster");

    await waitFor(() => {
      expect(toast?.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();
    });
  });
});
