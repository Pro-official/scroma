import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("should render the main heading", () => {
    render(<Home />);
    const heading = screen.getByText("Scroma");
    expect(heading).toBeTruthy();
  });

  it("should render the description", () => {
    render(<Home />);
    const description = screen.getByText("Screenshot Mockup Tool");
    expect(description).toBeTruthy();
  });

  it("should have proper CSS classes for layout", () => {
    const { container } = render(<Home />);
    const main = container.querySelector("main");
    expect(main).toHaveClass("flex", "flex-col", "h-screen");
  });
});
