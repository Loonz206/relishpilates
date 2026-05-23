import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders main element with id=main-content", () => {
    render(<Home />);
    expect(document.getElementById("main-content")).toBeInTheDocument();
  });

  it("renders the Navbar", () => {
    render(<Home />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the hero heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /yummy, challenging, feel-good pilates/i })
    ).toBeInTheDocument();
  });

  it("renders the About section heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /strengthen\. stretch\. savor\./i })
    ).toBeInTheDocument();
  });

  it("renders the Steps section heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /ready to pilates/i })
    ).toBeInTheDocument();
  });

  it("renders the Footer", () => {
    render(<Home />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
