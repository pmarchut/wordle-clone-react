import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppSwitch from "../src/components/AppSwitch"; // komponent w React
import '@testing-library/jest-dom'

const label = "Hard Mode";

const factoryRender = (value: boolean = false, onToggle = jest.fn()) => {
  render(<AppSwitch label={label} value={value} onToggle={onToggle} />);
  const switchWrapper = document.getElementById(label);
  const button = switchWrapper?.querySelector("button");
  return { switchWrapper, button, onToggle };
};

describe("AppSwitch", () => {
  it("sets id and aria-label correctly from prop", () => {
    const { switchWrapper, button } = factoryRender();

    expect(switchWrapper).not.toBeNull();
    expect(switchWrapper).toHaveAttribute("id", label);
    expect(button).not.toBeNull();
    expect(button).toHaveAttribute("aria-label", label);
  });

  it("sets value (checked state) correctly from prop", () => {
    const { switchWrapper, button } = factoryRender(true);

    expect(switchWrapper).toHaveClass("checked");
    expect(button).toHaveAttribute("aria-checked", "true");
  });

  it("calls onToggle with true when clicked (false to true)", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    const { button } = factoryRender(false, onToggle);

    await user.click(button!);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("calls onToggle with false when clicked (true to false)", async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    const { button } = factoryRender(true, onToggle);

    await user.click(button!);
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
