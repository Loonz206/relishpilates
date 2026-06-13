/**
 * Module-level mock to cover conditional branches in pricing/page.tsx
 * that the regular test (using embedded defaultContent) cannot reach.
 */
const mockGetPricing = jest.fn();

jest.mock("../../lib/cms", () => ({
  getPricingPageContent: (...args: unknown[]) => mockGetPricing(...args),
}));

import { render, screen } from "@testing-library/react";
import PricingPage from "./page";
import { defaultContent } from "../../lib/cms/default-content";

describe("Pricing page — conditional branches", () => {
  beforeEach(() => {
    mockGetPricing.mockResolvedValue(defaultContent.pricingPage);
  });

  it("omits the intro package note section when note is absent", async () => {
    mockGetPricing.mockResolvedValue({
      ...defaultContent.pricingPage,
      introPackage: { ...defaultContent.pricingPage.introPackage, note: undefined },
    });
    render(await PricingPage());
    expect(screen.queryByText(/first-time students only/i)).not.toBeInTheDocument();
  });

  it("renders <br> between lines for a multi-line package name", async () => {
    mockGetPricing.mockResolvedValue({
      ...defaultContent.pricingPage,
      introPackage: {
        ...defaultContent.pricingPage.introPackage,
        name: "Intro Special\n3-Session Pack",
      },
    });
    const { container } = render(await PricingPage());
    expect(container.querySelector("br")).toBeInTheDocument();
  });

  it("uses fallback aria-label for package without explicit ariaLabel", async () => {
    mockGetPricing.mockResolvedValue({
      ...defaultContent.pricingPage,
      standardPackages: [
        { name: "Test Pack", price: "$99", cta: { label: "Buy", href: "/#schedule" } },
      ],
    });
    render(await PricingPage());
    expect(screen.getByRole("link", { name: /purchase test pack/i })).toBeInTheDocument();
  });
});
