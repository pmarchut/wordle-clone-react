import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppSettings from "../src/components/AppSettings"; // komponent w React
import '@testing-library/jest-dom'

describe("AppSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = "";
  });

  it("should toggle wordle-hardmode in localStorage on switch click", async () => {
    const user = userEvent.setup();
    render(<AppSettings />);

    const switchElement = document.getElementById("Hard Mode");
    expect(switchElement).not.toBeNull();

    const switchButton = switchElement!.querySelector("button");
    expect(switchButton).not.toBeNull();

    // ✅ Początek – domyślny stan
    expect(localStorage.getItem("wordle-hardmode")).toBeNull();
    expect(switchElement).not.toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    // ✅ Klik
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-hardmode")).toBe("true");
    expect(switchElement).toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "true");

    // ✅ Klik ponownie
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-hardmode")).toBe("false");
    expect(switchElement).not.toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "false");
  });

  it("should toggle wordle-darkmode in body element and localStorage on switch click", async () => {
    const user = userEvent.setup();

    // Początkowy stan: darkmode włączony
    localStorage.setItem("wordle-darkmode", "true");
    document.body.classList.add("dark");

    const toggleSpy = jest.spyOn(document.body.classList, "toggle");

    render(<AppSettings />);

    const switchElement = document.getElementById("Dark Mode");
    expect(switchElement).not.toBeNull();

    const switchButton = switchElement!.querySelector("button");
    expect(switchButton).not.toBeNull();

    // ✅ Początkowy stan
    expect(localStorage.getItem("wordle-darkmode")).toBe("true");
    expect(switchElement).toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "true");

    // ✅ Wyłącz tryb ciemny
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-darkmode")).toBe("false");
    expect(switchElement).not.toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "false");
    expect(toggleSpy).toHaveBeenNthCalledWith(1, "dark", false);

    // ✅ Włącz ponownie
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-darkmode")).toBe("true");
    expect(switchElement).toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "true");
    expect(toggleSpy).toHaveBeenNthCalledWith(2, "dark", true);

    toggleSpy.mockRestore();
  });

  it("should toggle wordle-colorblind in body element and localStorage on switch click", async () => {
    const user = userEvent.setup();

    // Początkowy stan: darkmode włączony
    localStorage.setItem("wordle-colorblind", "true");
    document.body.classList.add("dark");

    const toggleSpy = jest.spyOn(document.body.classList, "toggle");

    render(<AppSettings />);

    const switchElement = document.getElementById("High Contrast Mode");
    expect(switchElement).not.toBeNull();

    const switchButton = switchElement!.querySelector("button");
    expect(switchButton).not.toBeNull();

    // ✅ Początkowy stan
    expect(localStorage.getItem("wordle-colorblind")).toBe("true");
    expect(switchElement).toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "true");

    // ✅ Wyłącz tryb ciemny
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-colorblind")).toBe("false");
    expect(switchElement).not.toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "false");
    expect(toggleSpy).toHaveBeenNthCalledWith(1, "colorblind", false);

    // ✅ Włącz ponownie
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-colorblind")).toBe("true");
    expect(switchElement).toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "true");
    expect(toggleSpy).toHaveBeenNthCalledWith(2, "colorblind", true);

    toggleSpy.mockRestore();
  });

  it("should toggle wordle-onscreen-input-only in localStorage on switch click", async () => {
    const user = userEvent.setup();
    render(<AppSettings />);

    const switchElement = document.getElementById("Virtual Keyboard Input Only");
    expect(switchElement).not.toBeNull();

    const switchButton = switchElement!.querySelector("button");
    expect(switchButton).not.toBeNull();

    // ✅ Początek – domyślny stan
    expect(localStorage.getItem("wordle-onscreen-input-only")).toBeNull();
    expect(switchElement).not.toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "false");

    // ✅ Klik
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-onscreen-input-only")).toBe("true");
    expect(switchElement).toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "true");

    // ✅ Klik ponownie
    await user.click(switchButton!);

    expect(localStorage.getItem("wordle-onscreen-input-only")).toBe("false");
    expect(switchElement).not.toHaveClass("checked");
    expect(switchButton).toHaveAttribute("aria-checked", "false");
  });
});
