import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import GameKeyboard from '@/components/GameKeyboard';
import { Provider } from 'react-redux';
import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import guessesReducer, { GuessesState } from '@/stores/guessesSlice';
import toastsReducer from '@/stores/toastsSlice';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'

const createTestStore = (overrides?: {
  guesses?: typeof guessesReducer | ((state: GuessesState | undefined, action: UnknownAction) => GuessesState),
}) =>
  configureStore({
    reducer: {
      guesses: overrides?.guesses || guessesReducer,
      toasts: toastsReducer,
    },
  });

const factoryRender = (storeOverride?: ReturnType<typeof createTestStore>) => {
  const store = storeOverride ?? createTestStore();

  return {
    wrapper: render(
      <Provider store={store}>
        <GameKeyboard />
      </Provider>
    ),
    store,
  };
};

describe('GameKeyboard', () => {
  // 🧹 Czyścimy środowisko po każdym teście
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders all keyboard buttons', () => {
    factoryRender();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(28); // 26 liter + Enter + Backspace
  });

  it('calls enterLetter and handleBackspace when keys are clicked', async () => {
    const { store } = factoryRender();

    const aButton = screen.getByRole('button', { name: 'add a' });
    await fireEvent.click(aButton);

    let state = store.getState().guesses;
    let guessIndex = state.checkResults.findIndex((row) => row.every((r) => r === ''));
    expect(state.guesses[guessIndex]).toBe('A');

    const backspaceButton = screen.getByRole('button', { name: 'backspace' });
    await fireEvent.click(backspaceButton);

    state = store.getState().guesses;
    guessIndex = state.checkResults.findIndex((row) => row.every((r) => r === ''));
    expect(state.guesses[guessIndex]).toBe('');
  });

  it('handles physical keyboard input correctly', async () => {
    const { store } = factoryRender();

    await fireEvent.keyDown(window, { key: 'a' });

    let state = store.getState().guesses;
    let guessIndex = state.checkResults.findIndex((row) => row.every((r) => r === ''));
    expect(state.guesses[guessIndex]).toBe('A');

    await fireEvent.keyDown(window, { key: 'Backspace' });

    state = store.getState().guesses;
    guessIndex = state.checkResults.findIndex((row) => row.every((r) => r === ''));
    expect(state.guesses[guessIndex]).toBe('');
  });

  it('blocks physical keyboard input when wordle-onscreen-input-only is true in localStorage', async () => {
    localStorage.setItem('wordle-onscreen-input-only', 'true');
    const { store } = factoryRender();

    await fireEvent.keyDown(window, { key: 'a' });

    const state = store.getState().guesses;
    const guessIndex = state.checkResults.findIndex((row) => row.every((r) => r === ''));
    expect(state.guesses[guessIndex]).toBe('');
  });

  it("does not call enterLetter again when Enter is pressed after focusing a letter button", async () => {
    const user = userEvent.setup();

    const enterLetterSpy = jest.fn();
    const setInvalidSpy = jest.fn();

    const customReducer = (
      state: GuessesState | undefined = undefined,
      action: UnknownAction
    ) => {
      if (action.type === "guesses/enterLetter") {
        enterLetterSpy();
      }
      if (action.type === "guesses/setInvalid") {
        setInvalidSpy();
      }
      return guessesReducer(state, action);
    };

    const customStore = createTestStore({ guesses: customReducer });

    factoryRender(customStore);

    const letterButton = screen.getByRole("button", { name: "add a" });

    // 🔍 Ustaw focus + klik
    letterButton.focus();
    await user.click(letterButton);

    // 🔑 Naciśnij Enter na globalnym oknie
    await user.keyboard("{Enter}");

    // ✅ enterLetter tylko raz – klik myszy
    expect(enterLetterSpy).toHaveBeenCalledTimes(1);

    // ✅ handleEnter powoduje setInvalid
    await waitFor(() => {
      expect(setInvalidSpy).toHaveBeenCalled();
    });
  });

  it("does not call handleEnter when Enter is pressed while a key is focused", async () => {
    const user = userEvent.setup();

    const handleEnterSpy = jest.fn();

    // własny reducer, który przechwytuje `handleEnter` przez `setInvalid`
    const customReducer = (
      state: GuessesState | undefined = undefined,
      action: UnknownAction
    ) => {
      if (action.type === "guesses/setInvalid") {
        handleEnterSpy();
      }
      return guessesReducer(state, action);
    };

    const store = createTestStore({ guesses: customReducer });

    factoryRender(store);

    const letterButton = screen.getByRole("button", { name: "add a" });

    // 👁️ Ręczne ustawienie focusu – tak jakby użytkownik kliknął klawiaturą
    letterButton.focus();
    expect(letterButton).toHaveFocus();

    // 🔑 Naciśnięcie Enter na globalnym oknie
    await user.keyboard("{Enter}");

    // ❌ handleEnter (czyli dispatch setInvalid) nie powinien się wywołać,
    // ponieważ przeglądarka "kliknęłaby" ten przycisk zamiast odpalić keydown
    expect(handleEnterSpy).not.toHaveBeenCalled();
  });

  it('calls preventDefault on mousedown to preserve focus', async () => {
    factoryRender();

    const button = screen.getByRole('button', { name: 'add a' });

    // 👁️ Tworzymy własny event, który można śledzić
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    // 🕵️‍♂️ Spy na metodę preventDefault tego eventu
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    // 🧪 Rzucamy event na DOM
    button.dispatchEvent(event);

    // ✅ Sprawdzamy, czy preventDefault został wywołany
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
