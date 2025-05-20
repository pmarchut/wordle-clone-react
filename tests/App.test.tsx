import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dialogsReducer, { DialogProps } from "../src/stores/dialogsSlice";
import guessesReducer from "../src/stores/guessesSlice";
import toastsReducer from "../src/stores/toastsSlice";
import userEvent from "@testing-library/user-event";
import App from '../src/App';

// 📌 Funkcja pomocnicza
const factoryRender = (dialogState: DialogProps | null = null) => {
  const store = configureStore({
    reducer: {
      dialogs: dialogsReducer,
      guesses: guessesReducer,
      toasts: toastsReducer,
    },
    preloadedState: {
      dialogs: {
        dialog: dialogState,
      }
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

describe("App", () => {
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
});
