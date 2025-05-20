import { render, screen } from "@testing-library/react";
import AppDropdown from "@/components/AppDropdown"; // dopasuj ścieżkę
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dialogsReducer from "../src/stores/dialogsSlice";

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
                <AppDropdown 
                    leftPosition={200}
                    closeDropdown={jest.fn()} // mock funkcji closeDropdown
                />
            </Provider>
        ),
        store,
    };
};

describe("AppDropdown", () => {
  it("sets correct left style based on prop", () => {
    factoryRender();
    
    const dropdown = screen.getByRole("menu"); // zakładamy ul[role="menu"]
    expect(dropdown).toHaveStyle("left: 200px");
  });

  it("renders the correct href in menu links", () => {
    factoryRender();

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);

    expect(menuItems[1]).toHaveAttribute(
      "href",
      "https://www.nytimes.com/2022/02/10/crosswords/best-wordle-tips.html"
    );

    expect(menuItems[2]).toHaveAttribute(
      "href",
      "https://www.nytimes.com/2023/08/01/crosswords/how-to-talk-about-wordle.html"
    );
  });
});
