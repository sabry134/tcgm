import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../components/Button";

test("renders a button with the given label", () => {
  render(<Button label="Click Me" onClick={() => {}} />);
  expect(screen.getByText("Click Me")).toBeInTheDocument();
});

test("calls the onClick handler when clicked", () => {
  const onClickMock = jest.fn();
  render(<Button label="Click Me" onClick={onClickMock} />);
  fireEvent.click(screen.getByText("Click Me"));
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
