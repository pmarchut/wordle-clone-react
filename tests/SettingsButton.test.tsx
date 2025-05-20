import { render, screen } from "@testing-library/react";
import SettingsButton from "@/components/SettingsButton";
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
                <SettingsButton />
            </Provider>
        ),
        store,
    };
};

describe("SettingsButton", () => {
  it("has icon that matches snapshot", () => {
    factoryRender();
    const icon = screen.getByTestId("settings-button");
    expect(icon).toBeInTheDocument();
    expect(icon).toMatchSnapshot();
  });
});
