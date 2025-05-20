import { render, screen, fireEvent, act } from "@testing-library/react";
import HelpButton from "@/components/HelpButton";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dialogsReducer from "../src/stores/dialogsSlice";

// Ustawienia pozycji i szerokości elementów
const left = 1000;
const width = 100;
const dropdownWidth = 178;

// 📌 Funkcja pomocnicza
const factoryRender = () => {
    const store = configureStore({
        reducer: {
            dialogs: dialogsReducer,
        },
    });
  
    return {
        ...render(
            <Provider store={store}>
                <HelpButton />
            </Provider>
        ),
        store,
    };
};

describe("HelpButton", () => {
  beforeAll(() => {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left,
      right: left + width,
      width,
      top: 0,
      bottom: 0,
      height: 0,
      x: left,
      y: 0,
      toJSON: () => {},
    });
  });

  it("has icon that matches snapshot", () => {
    factoryRender();
    const icon = screen.getByTestId("help-button");
    expect(icon).toBeInTheDocument();
    expect(icon).toMatchSnapshot();
  });

  it("shows menu when clicked and passes correct leftPosition", async () => {
    factoryRender();
  
    const button = screen.getByTestId("help-button");
  
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  
    fireEvent.click(button);
  
    const dropdown = await screen.findByRole("menu");
    expect(dropdown).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
  
    const expectedLeft = left + width - dropdownWidth;
  
    // Sprawdzenie stylu left
    expect(dropdown).toHaveStyle(`left: ${expectedLeft}px`);
  });

  it("renders only How to Play, Tips and Tricks and Glossary list items", async () => {
    factoryRender();
  
    fireEvent.click(screen.getByTestId("help-button"));
  
    const items = await screen.findAllByRole("menuitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("How to Play");
    expect(items[1]).toHaveTextContent("Tips and Tricks");
    expect(items[2]).toHaveTextContent("Glossary");
  });

  it("closes AppDropdown when clicking button again", async () => {
    factoryRender();
  
    const button = screen.getByTestId("help-button");
    await act(() => {
      fireEvent.click(button);
    })
  
    const dropdown = await screen.findByRole("menu");
    expect(dropdown).toBeInTheDocument();
  
    await act(() => new Promise((resolve) => setTimeout(resolve, 150))); // Więcej niż 100 ms
    await act(() => {
      fireEvent.click(button);
    })
  
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
