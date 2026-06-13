import { render, screen } from "@testing-library/react";
import PrivacyPage from "./page";

describe("Privacy page", () => {
  it("renders the Privacy Policy heading", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
  });

  it("renders policy section headings", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { name: /information we collect/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how we use your information/i })
    ).toBeInTheDocument();
  });

  it("renders all six policy sections", () => {
    render(<PrivacyPage />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(6);
  });
});
