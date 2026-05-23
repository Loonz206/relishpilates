import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders the logo with brand name", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /relishpilates/i })).toBeInTheDocument();
  });

  it("renders with aria-label on the nav element", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("renders all nav links", () => {
    render(<Navbar />);
    const links = ["Schedule", "Pricing", "Videos", "About", "FAQ"];
    links.forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("renders the Book a Session CTA button", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /book a session/i })).toBeInTheDocument();
  });

  it("logo links to the root", () => {
    render(<Navbar />);
    const logo = screen.getByRole("link", { name: /relishpilates/i });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("nav links point to correct hash anchors", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Schedule" })).toHaveAttribute("href", "#schedule");
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "#pricing");
    expect(screen.getByRole("link", { name: "Videos" })).toHaveAttribute("href", "#videos");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "#about");
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "#faq");
  });

  it("renders inside a header landmark", () => {
    render(<Navbar />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
