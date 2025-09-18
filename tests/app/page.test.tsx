import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("should render the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /Scroma Upload/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should render the description", () => {
    render(<Home />);
    const description = screen.getByText(/Create beautiful screenshot mockups in seconds/i);
    expect(description).toBeInTheDocument();
  });

  it("should render the upload zone", () => {
    render(<Home />);
    const uploadZone = screen.getByRole("button", {
      name: /Upload zone/i,
    });
    expect(uploadZone).toBeInTheDocument();
  });
});
