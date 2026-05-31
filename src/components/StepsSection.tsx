import Button from "@/components/Button";
import StepCard from "@/components/StepCard";

const steps = [
  {
    number: "1",
    title: "Schedule a good time",
    bullets: [
      "Book a time for your Pilates workout",
      "Each session is 60 minutes",
      "Create an account so you can make changes just in case",
      "Check your confirmation email for everything you need",
    ],
  },
  {
    number: "2",
    title: "Tell me about you",
    bullets: [
      "Fill out a quick form before your session (included in your confirmation)",
      "Relax — I'll use what you share to create a workout made just for you",
    ],
  },
  {
    number: "3",
    title: "Zoom your workout",
    bullets: [
      "Grab your mat and find some space to move your body",
      "Log into Zoom at your scheduled time",
      "Do Pilates!",
    ],
  },
];

export default function StepsSection() {
  return (
    <section
      id="schedule"
      className="w-full pb-16 lg:pb-[120px] scroll-mt-24"
      aria-labelledby="steps-heading"
    >
      <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-10 pt-10 lg:pt-12">
      {/* Decorative drips */}
      <div
        className="pointer-events-none absolute left-8 top-0 lg:left-12"
        aria-hidden="true"
      >
        <svg
          width="182"
          height="120"
          viewBox="0 0 182 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[88px] w-[132px] overflow-visible lg:h-[120px] lg:w-[182px]"
        >
          <path
            d="M44 6C31 18 20 40 24 55C27 67 41 71 50 63C58 56 58 43 60 31C62 20 66 11 74 5C62 8 53 7 44 6Z"
            fill="#397C52"
          />
          <path
            d="M100 0C84 11 70 40 69 63C68 88 82 109 98 114C113 119 126 106 127 85C128 61 118 34 112 16C109 8 106 3 100 0Z"
            fill="#397C52"
          />
          <path
            d="M136 5C145 11 149 20 151 31C153 43 153 56 161 63C170 71 184 67 187 55C191 40 180 18 167 6C158 7 148 8 136 5Z"
            fill="#397C52"
          />
        </svg>
      </div>

      {/* Heading */}
      <div className="lg:col-span-12 flex flex-col items-center text-center">
        <p className="font-nunito font-light text-dark text-[32px] leading-[48px]">
          How to Relish
        </p>
        <h2
          id="steps-heading"
          className="font-ramillas font-black text-dark-pickle text-[clamp(40px,4.5vw,64px)] leading-[1.25] text-balance"
        >
          Ready to Pilates
        </h2>
      </div>

      {/* Step cards */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {steps.map((step) => (
          <StepCard
            key={step.number}
            number={step.number}
            title={step.title}
            bullets={step.bullets}
          />
        ))}
      </div>

      {/* CTA */}
      <Button href="#schedule" className="lg:col-span-12 justify-self-center">
        Book a session
      </Button>
      </div>
    </section>
  );
}
