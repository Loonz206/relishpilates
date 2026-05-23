import { render, screen } from "@testing-library/react";
import AboutSection from "./AboutSection";

describe("AboutSection", () => {
  it("renders the h2 heading", () => {
    render(<AboutSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /strengthen\. stretch\. savor\./i })
    ).toBeInTheDocument();
  });

  it("renders the section with aria-labelledby pointing to about-heading", () => {
    render(<AboutSection />);
    const section = screen.getByRole("region", { name: /strengthen\. stretch\. savor\./i });
    expect(section).toBeInTheDocument();
  });

  it("renders the body copy about sharing movement", () => {
    render(<AboutSection />);
    expect(screen.getByText(/relish pilates is all about sharing movement/i)).toBeInTheDocument();
  });

  it("renders the decorative graphic image with empty alt inside aria-hidden wrapper", () => {
    const { container } = render(<AboutSection />);
    // The decorative image is inside an aria-hidden div, so query the DOM directly
    const decorativeImg = container.querySelector('img[alt=""]');
    expect(decorativeImg).toBeInTheDocument();
  });

  it("has the about-heading id on the h2", () => {
    render(<AboutSection />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "about-heading");
  });
});
