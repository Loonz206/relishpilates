import { render, screen } from "@testing-library/react";
import TermsPage from "./page";

describe("Terms page", () => {
  it("renders the Terms of Service heading", () => {
    render(<TermsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /terms of service/i })
    ).toBeInTheDocument();
  });

  it("renders terms section headings", () => {
    render(<TermsPage />);
    expect(screen.getByRole("heading", { name: /acceptance of terms/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /session cancellation/i })).toBeInTheDocument();
  });

  it("renders all eight terms sections", () => {
    render(<TermsPage />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(8);
  });
});
