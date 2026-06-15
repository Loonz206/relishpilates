import { render, screen } from "@testing-library/react";
import TermsPage, { generateMetadata } from "./page";

describe("Terms page", () => {
  it("generateMetadata returns correct title and description", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Terms of Service | Relish Pilates");
    expect(metadata.description).toContain("terms of service");
  });

  it("renders the Terms of Service heading", async () => {
    render(await TermsPage());
    expect(
      screen.getByRole("heading", { level: 1, name: /terms of service/i })
    ).toBeInTheDocument();
  });

  it("renders terms section headings", async () => {
    render(await TermsPage());
    expect(screen.getByRole("heading", { name: /acceptance of terms/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /session cancellation/i })).toBeInTheDocument();
  });

  it("renders all eight terms sections", async () => {
    render(await TermsPage());
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(8);
  });
});
