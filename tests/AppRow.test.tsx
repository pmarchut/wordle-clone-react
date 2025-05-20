import { render, screen } from "@testing-library/react";
import AppRow from "@/components/AppRow";
import '@testing-library/jest-dom'

describe("AppRow", () => {
  it("renders the correct number of tiles and not small", () => {
    render(<AppRow word="HELLO" ariaLabel="Row 1" wordCheckResults={['', '', '', '', '']} />);

    const tiles = screen.getAllByTestId("tile");
    expect(tiles).toHaveLength(5);

    tiles.forEach((tile) => {
      expect(tile.classList.contains("small")).toBe(false);
    });
  });

  it("passes correct letters and attributes to tiles (full word)", () => {
    render(<AppRow word="HELLO" ariaLabel="Row 1" wordCheckResults={['', '', '', '', '']} />);

    const tiles = screen.getAllByTestId("tile");

    const letters = ["H", "E", "L", "L", "O"];
    const ordinals = ["1st", "2nd", "3rd", "4th", "5th"];

    letters.forEach((letter, index) => {
      expect(tiles[index]).toHaveTextContent(letter);
      expect(tiles[index]).toHaveAttribute("aria-label", `${ordinals[index]} letter, ${letter}`);
      expect(tiles[index]).toHaveAttribute("data-state", "tbd");
    });
  });

  it("handles incomplete word and sets empty states", () => {
    render(<AppRow word="HE" ariaLabel="Row 1" wordCheckResults={['', '', '', '', '']} />);

    const tiles = screen.getAllByTestId("tile");

    expect(tiles[0]).toHaveTextContent("H");
    expect(tiles[1]).toHaveTextContent("E");

    expect(tiles[0]).toHaveAttribute("aria-label", "1st letter, H");
    expect(tiles[1]).toHaveAttribute("aria-label", "2nd letter, E");
    expect(tiles[2]).toHaveAttribute("aria-label", "3rd letter, empty");
    expect(tiles[3]).toHaveAttribute("aria-label", "4th letter, empty");
    expect(tiles[4]).toHaveAttribute("aria-label", "5th letter, empty");

    expect(tiles[0]).toHaveAttribute("data-state", "tbd");
    expect(tiles[1]).toHaveAttribute("data-state", "tbd");
    expect(tiles[2]).toHaveAttribute("data-state", "empty");
    expect(tiles[3]).toHaveAttribute("data-state", "empty");
    expect(tiles[4]).toHaveAttribute("data-state", "empty");
  });

  it("sets correct aria-label from props", () => {
    const { container } = render(<AppRow word="" ariaLabel="Row 1" wordCheckResults={['', '', '', '', '']} />);
    expect(container.firstChild).toHaveAttribute("aria-label", "Row 1");
  });
});
