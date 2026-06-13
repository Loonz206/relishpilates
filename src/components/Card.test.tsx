import { render, screen } from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText("Hello Card")).toBeInTheDocument();
  });

  it("applies default border and shadow classes when not specified", () => {
    render(<Card>Content</Card>);
    const card = screen.getByText("Content");
    expect(card.className).toContain("border-dark");
    expect(card.className).toContain("shadow-[8px_8px_0px_#1f5534]");
  });

  it("applies custom className when provided", () => {
    render(<Card className="p-10">Content</Card>);
    const card = screen.getByText("Content");
    expect(card.className).toContain("p-10");
  });

  it("renders without optional className (filter Boolean removes falsy)", () => {
    render(<Card>No extra class</Card>);
    const card = screen.getByText("No extra class");
    // className should not contain 'undefined' or 'false' from filter
    expect(card.className).not.toContain("undefined");
    expect(card.className).not.toContain("false");
  });

  it("applies custom border and shadow classes", () => {
    render(
      <Card borderClassName="border-lavender" shadowClassName="shadow-none">
        Custom
      </Card>
    );
    const card = screen.getByText("Custom");
    expect(card.className).toContain("border-lavender");
    expect(card.className).toContain("shadow-none");
  });
});
