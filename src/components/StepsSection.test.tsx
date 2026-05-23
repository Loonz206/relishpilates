import { render, screen } from "@testing-library/react";
import StepsSection from "./StepsSection";

describe("StepsSection", () => {
  it("renders the section with id=schedule", () => {
    render(<StepsSection />);
    const section = document.getElementById("schedule");
    expect(section).toBeInTheDocument();
  });

  it("renders the h2 heading 'Ready to Pilates'", () => {
    render(<StepsSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /ready to pilates/i })
    ).toBeInTheDocument();
  });

  it("renders the 'How to Relish' eyebrow text", () => {
    render(<StepsSection />);
    expect(screen.getByText(/how to relish/i)).toBeInTheDocument();
  });

  it("renders all three step headings", () => {
    render(<StepsSection />);
    expect(screen.getByRole("heading", { name: /schedule a good time/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /tell me about you/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /zoom your workout/i })).toBeInTheDocument();
  });

  it("renders the step numbers 1, 2, 3", () => {
    render(<StepsSection />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders step 1 bullet points", () => {
    render(<StepsSection />);
    expect(screen.getByText(/book a time for your pilates workout/i)).toBeInTheDocument();
    expect(screen.getByText(/each session is 60 minutes/i)).toBeInTheDocument();
  });

  it("renders step 2 bullet points", () => {
    render(<StepsSection />);
    expect(screen.getByText(/fill out a quick form before your session/i)).toBeInTheDocument();
  });

  it("renders step 3 bullet points", () => {
    render(<StepsSection />);
    expect(screen.getByText(/grab your mat and find some space/i)).toBeInTheDocument();
    expect(screen.getByText(/log into zoom at your scheduled time/i)).toBeInTheDocument();
  });

  it("renders the Book a session CTA link", () => {
    render(<StepsSection />);
    expect(screen.getByRole("link", { name: /book a session/i })).toBeInTheDocument();
  });

  it("CTA link points to #schedule", () => {
    render(<StepsSection />);
    expect(screen.getByRole("link", { name: /book a session/i })).toHaveAttribute("href", "#schedule");
  });

  it("has aria-labelledby on the section", () => {
    render(<StepsSection />);
    const section = screen.getByRole("region", { name: /ready to pilates/i });
    expect(section).toBeInTheDocument();
  });
});
