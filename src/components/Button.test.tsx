import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button — as link", () => {
  it("renders an anchor tag when href is provided", () => {
    render(<Button href="/pricing">View Pricing</Button>);
    expect(screen.getByRole("link", { name: /view pricing/i })).toBeInTheDocument();
  });

  it("applies extra className when provided", () => {
    render(
      <Button href="/pricing" className="extra-class">
        View Pricing
      </Button>
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("extra-class");
  });
});

describe("Button — as button", () => {
  it("renders a button element when no href provided", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("uses default type=button when type not specified", () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("uses explicit type when provided", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("uses base classes only when no className provided", () => {
    render(<Button>No extra class</Button>);
    const btn = screen.getByRole("button");
    // Should have bg-lavender class from baseClasses (no extra appended)
    expect(btn.className).toContain("bg-lavender");
    expect(btn.className).not.toContain("undefined");
  });

  it("sets ariaLabel attribute when provided", () => {
    render(<Button ariaLabel="Accessible label">Action</Button>);
    expect(screen.getByRole("button", { name: /accessible label/i })).toBeInTheDocument();
  });
});
