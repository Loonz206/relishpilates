import { render, screen } from "@testing-library/react";
import PricingPage, { generateMetadata } from "./page";

describe("Pricing page", () => {
  it("generateMetadata returns correct title and description", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Pricing | Relish Pilates");
    expect(metadata.description).toContain("packages");
  });
  it("renders the pricing heading", async () => {
    render(await PricingPage());
    expect(screen.getByRole("heading", { level: 1, name: /pricing options/i })).toBeInTheDocument();
  });

  it("renders intro special package details", async () => {
    render(await PricingPage());
    expect(screen.getByRole("heading", { name: /intro special/i })).toBeInTheDocument();
    expect(screen.getByText(/\$195 \| \$65 per session/i)).toBeInTheDocument();
    expect(screen.getByText(/first-time students only/i)).toBeInTheDocument();
  });

  it("renders standard package options", async () => {
    render(await PricingPage());
    expect(screen.getByRole("heading", { name: /single session/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /5-session pack/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /10-session pack/i })).toBeInTheDocument();
  });

  it("renders purchase links", async () => {
    render(await PricingPage());
    const purchaseLinks = screen.getAllByRole("link", { name: /purchase/i });
    expect(purchaseLinks).toHaveLength(4);
  });

  it("links View FAQ to the FAQ page", async () => {
    render(await PricingPage());
    expect(screen.getByRole("link", { name: /view faq/i })).toHaveAttribute("href", "/faq");
  });
});
