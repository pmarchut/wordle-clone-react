import { render, screen, fireEvent } from "@testing-library/react";
import AppTile from '../src/components/AppTile'; // komponent w React
import '@testing-library/jest-dom'

// 📌 Funkcja pomocnicza
const factoryRender = () => {
  return render(
    <AppTile 
      ariaLabel="1st letter, W, correct"
      dataState="correct" 
      dataAnimation="flip-in"
    >
      w
    </AppTile>
  )
};

describe("AppTile", () => {
  it("sets aria-label correctly from props", () => {
    factoryRender();

    const tile = screen.getByTestId("tile");
    expect(tile).toHaveAttribute("aria-label", "1st letter, W, correct");
  });

  it("sets data-state correctly from props", () => {
    factoryRender();
    const tile = screen.getByTestId("tile");
    expect(tile).toHaveAttribute("data-state", "correct");
  });

  describe("AppTile", () => {
    it("applies animation props and handles flip-in → flip-out → idle transitions", () => {
      factoryRender();
  
      const tile = screen.getByTestId("tile");
      expect(tile).toHaveAttribute("data-animation", "flip-in");
      expect(tile).not.toHaveAttribute("aria-live", "off");
  
      // symulujemy animationend => flip-in → flip-out
      fireEvent.animationEnd(tile);
      expect(tile).toHaveAttribute("data-animation", "flip-out");
      expect(tile).not.toHaveAttribute("aria-live", "off");
  
      // symulujemy kolejny animationend => flip-out → idle
      fireEvent.animationEnd(tile);
      expect(tile).toHaveAttribute("data-animation", "idle");
      expect(tile).toHaveAttribute("aria-live", "off");
    });
  });
});
