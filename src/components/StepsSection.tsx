import Link from "next/link";

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
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 lg:px-10">
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
          <div
            key={step.number}
            className="flex-1 bg-light border border-dark rounded-3xl px-6 py-8 shadow-[8px_8px_0px_#dfff92] flex flex-col gap-2"
          >
            <p className="font-press text-lavender text-[32px] leading-10 [text-shadow:-2px_2px_0px_#1d1d1f]">
              {step.number}
            </p>
            <div className="flex flex-col gap-4 text-dark">
              <h3 className="font-ramillas font-black text-[32px] leading-10">
                {step.title}
              </h3>
              <ul className="font-nunito font-light text-lg leading-7 list-disc pl-6 flex flex-col gap-1">
                {step.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="#schedule"
        className="lg:col-span-12 justify-self-center bg-lavender border border-dark text-dark font-nunito font-normal text-lg leading-6 px-8 py-2 rounded-full shadow-[6px_6px_0px_#1d1d1f] no-underline motion-safe:hover:translate-x-[1px] motion-safe:hover:translate-y-[1px] motion-safe:hover:shadow-[4px_4px_0px_#1d1d1f] transition-[transform,box-shadow] touch-manipulation"
      >
        Book a session
      </Link>
      </div>
    </section>
  );
}
