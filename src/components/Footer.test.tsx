import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the footer landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the brand headline 'Relish Pilates'", () => {
    render(<Footer />);
    expect(screen.getByText("Relish Pilates")).toBeInTheDocument();
  });

  it("renders the contact form with aria-label", () => {
    render(<Footer />);
    expect(screen.getByRole("form", { name: /contact form/i })).toBeInTheDocument();
  });

  it("renders the 'Got questions?' heading", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: /got questions/i })).toBeInTheDocument();
  });

  it("renders Name, Email, and message inputs", () => {
    render(<Footer />);
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tell me what's on your mind/i)).toBeInTheDocument();
  });

  it("renders the Send Message submit button", () => {
    render(<Footer />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("Send Message button is type=submit", () => {
    render(<Footer />);
    expect(screen.getByRole("button", { name: /send message/i })).toHaveAttribute("type", "submit");
  });

  it("renders all navLinks", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Book Now" })).toHaveAttribute("href", "/#schedule");
    expect(screen.getByRole("link", { name: "Schedule" })).toHaveAttribute("href", "/#schedule");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: "Videos" })).toHaveAttribute("href", "/#videos");
  });

  it("renders all moreLinks", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "Privacy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms" })).toBeInTheDocument();
  });

  it("renders the Locations heading", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: /locations/i })).toBeInTheDocument();
  });

  it("renders the Instagram link with aria-label", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /instagram/i })).toBeInTheDocument();
  });

  it("Instagram link opens in a new tab with rel noopener", () => {
    render(<Footer />);
    const instaLink = screen.getByRole("link", { name: /instagram/i });
    expect(instaLink).toHaveAttribute("target", "_blank");
    expect(instaLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the Bremerton, WA location text", () => {
    render(<Footer />);
    expect(screen.getByText(/bremerton, wa/i)).toBeInTheDocument();
  });
});
