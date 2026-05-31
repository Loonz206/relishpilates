import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the hero heading", async () => {
    render(await Home());
    expect(
      screen.getByRole("heading", { level: 1, name: /yummy, challenging, feel-good pilates/i })
    ).toBeInTheDocument();
  });

  it("renders the About section heading", async () => {
    render(await Home());
    expect(
      screen.getByRole("heading", { name: /strengthen\. stretch\. savor\./i })
    ).toBeInTheDocument();
  });

  it("renders the Steps section heading", async () => {
    render(await Home());
    expect(screen.getByRole("heading", { name: /ready to pilates/i })).toBeInTheDocument();
  });
});
