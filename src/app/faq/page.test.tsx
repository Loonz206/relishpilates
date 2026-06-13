import { render, screen } from "@testing-library/react";
import FaqPage, { generateMetadata } from "./page";

describe("FAQ page", () => {
  it("generateMetadata returns correct title and description", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("FAQ | Relish Pilates");
    expect(metadata.description).toContain("questions");
  });
  it("renders the main FAQ heading", async () => {
    render(await FaqPage());
    expect(
      screen.getByRole("heading", { level: 1, name: /frequently asked questions/i })
    ).toBeInTheDocument();
  });

  it("renders two FAQ cards with example content", async () => {
    render(await FaqPage());

    const faqTitles = screen.getAllByRole("heading", { level: 2, name: /faq title/i });
    const faqBody = screen.getAllByText(/paragraph 1 body copy/i);

    expect(faqTitles).toHaveLength(2);
    expect(faqBody).toHaveLength(2);
  });
});
