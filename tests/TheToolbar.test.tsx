import { render, screen, waitFor, act } from "@testing-library/react";
import TheToolbar from "@/components/TheToolbar";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dialogsReducer from "../src/stores/dialogSlice";
import userEvent from "@testing-library/user-event";

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
                <TheToolbar />
            </Provider>
        ),
        store,
    };
};

describe("TheToolbar", () => {
  it("renders Toolbar component", () => {
    factoryRender();
    const toolbarElement = screen.getByTestId("toolbar");
    expect(toolbarElement).toBeInTheDocument();
  });

  it("renders only Help and Settings buttons", () => {
    factoryRender();

    const helpButton = screen.getByRole("button", { name: "Help" });
    const settingsButton = screen.getByRole("button", { name: "Settings" });

    expect(helpButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();

    const allButtons = screen.getAllByRole("button");
    expect(allButtons).toHaveLength(2);
  });

  it("closes AppDropdown when clicking outside", async () => {
    const user = userEvent.setup();
    factoryRender();

    const helpButton = screen.getByRole("button", { name: "Help" });

    await act(async () => {
      // 🔥 Klikamy Help (otwiera dropdown)
      await user.click(helpButton);
    })
    
    // ✅ Dropdown powinien się pojawić (np. <ul role="menu">)
    const dropdown = await screen.findByRole("menu");
    expect(dropdown).toBeInTheDocument();

    await act(() => new Promise((resolve) => setTimeout(resolve, 150))); // Więcej niż 100 ms
    await act(async () => {
      // 🔥 Klikamy poza dropdownem (np. na document.body)
      await user.click(document.body);
    })
    
    // 🔄 Czekamy aż dropdown zniknie
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    }, { timeout: 1000 });
  });
});
