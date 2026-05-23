import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("renders the h1 heading", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("heading", { level: 1, name: /yummy, challenging, feel-good pilates/i })
    ).toBeInTheDocument();
  });

  it("renders the section with aria-labelledby pointing to hero-heading", () => {
    render(<HeroSection />);
    const section = screen.getByRole("region", { name: /yummy, challenging, feel-good pilates/i });
    expect(section).toBeInTheDocument();
  });

  it("renders the Book a session CTA link", () => {
    render(<HeroSection />);
    expect(screen.getByRole("link", { name: /book a session/i })).toBeInTheDocument();
  });

  it("CTA link points to #schedule", () => {
    render(<HeroSection />);
    expect(screen.getByRole("link", { name: /book a session/i })).toHaveAttribute("href", "#schedule");
  });

  it("renders the welcome image with alt text", () => {
    render(<HeroSection />);
    const images = screen.getAllByAltText(/relish pilates welcome/i);
    expect(images.length).toBeGreaterThan(0);
  });

  it("renders the body copy about virtual classes", () => {
    render(<HeroSection />);
    expect(screen.getByText(/virtual pilates classes built entirely around you/i)).toBeInTheDocument();
  });

  it("renders the mermaid pose image", () => {
    render(<HeroSection />);
    expect(screen.getByAltText(/pilates mermaid pose/i)).toBeInTheDocument();
  });

  it("renders the leg pull back image", () => {
    render(<HeroSection />);
    expect(screen.getByAltText(/pilates leg pull back/i)).toBeInTheDocument();
  });
});
