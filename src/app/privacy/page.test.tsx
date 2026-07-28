import { render, screen } from "@testing-library/react";
import PrivacyPage, { generateMetadata } from "./page";

describe("Privacy page", () => {
  it("generateMetadata returns correct title and description", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Privacy Policy | Relish Pilates");
    expect(metadata.description).toContain("privacy policy");
  });

  it("renders the Privacy Policy heading", async () => {
    render(await PrivacyPage());
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
  });

  it("renders policy section headings", async () => {
    render(await PrivacyPage());
    expect(screen.getByRole("heading", { name: /information we collect/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /how we use your information/i })
    ).toBeInTheDocument();
  });

  it("renders all six policy sections", async () => {
    render(await PrivacyPage());
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(6);
  });
});
