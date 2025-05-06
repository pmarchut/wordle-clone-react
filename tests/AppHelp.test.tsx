import { render, within } from "@testing-library/react";
import AppHelp from "../src/components/AppHelp"; // komponent w React
import '@testing-library/jest-dom'

describe("AppHelp", () => {
  it("renders 5 wordy, light and rogue small letters", () => {
    const { getAllByTestId } = render(<AppHelp />);

    const wordyLetters = getAllByTestId("wordy-letter");
    const lightLetters = getAllByTestId("light-letter");
    const rogueLetters = getAllByTestId("rogue-letter");

    expect(wordyLetters).toHaveLength(5);
    expect(lightLetters).toHaveLength(5);
    expect(rogueLetters).toHaveLength(5);

    [...wordyLetters, ...lightLetters, ...rogueLetters].forEach((letter) => {
      const tile = within(letter).getByTestId("tile");
      expect(tile).toHaveClass("small");
    });
  });
});
