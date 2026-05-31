import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";

const packageHighlights = [
  "Each session is 55-60 minutes",
  "Custom programming built around your body",
  "One-on-one attention, every session",
  "Real feedback, in real time",
];

const standardPackages = [
  {
    name: "Single Session",
    price: "$75 per session",
  },
  {
    name: "5-Session Pack",
    price: "$360 | $72 per session",
  },
  {
    name: "10-Session Pack",
    price: "$700 | $70 per session",
  },
];

export const metadata: Metadata = {
  title: "Pricing | Relish Pilates",
  description:
    "Explore Relish Pilates session packages, including intro and multi-session pricing options.",
};

export default function PricingPage() {
  return (
    <section className="w-full pb-16 lg:pb-24" aria-labelledby="pricing-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="pt-8 lg:pt-12">
          <h1
            id="pricing-heading"
            className="text-center font-ramillas font-black text-dark-pickle text-[clamp(44px,6vw,72px)] leading-[1.1]"
          >
            Pricing options
          </h1>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="font-ramillas font-black text-dark text-[clamp(44px,5vw,60px)] leading-[1.05]">
              Packages
            </h2>

            <ul className="mt-6 space-y-4 text-center lg:text-left">
              {packageHighlights.map((line) => (
                <li key={line} className="font-nunito font-light text-dark text-[28px] leading-[1.25]">
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center lg:text-left">
              <p className="font-nunito font-light italic text-dark text-xl leading-8">
                Sessions expire 6 months from purchase date
              </p>
              <p className="font-nunito font-light italic text-dark text-xl leading-8">
                Tax included at checkout
              </p>
              <Link
                href="/faq"
                className="mt-5 inline-block font-nunito text-xl leading-8 underline text-[#6d59e5]"
              >
                View FAQ
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-9">
            <Card
              className="p-5 sm:p-7"
              borderClassName="border-dark"
              shadowClassName="shadow-[8px_8px_0px_#6d59e5]"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <h3 className="font-ramillas font-black text-dark text-[clamp(40px,4.2vw,56px)] leading-[1.05]">
                    Intro Special
                    <br />
                    3-Session Pack
                  </h3>
                  <p className="mt-3 font-nunito font-light text-dark text-[30px] leading-[1.2]">
                    $195 | $65 per session
                  </p>
                  <p className="mt-1 font-nunito font-light italic text-dark text-[28px] leading-[1.2]">
                    *First-time students only
                  </p>
                </div>

                <Link
                  href="/#schedule"
                  className="justify-self-start sm:justify-self-end inline-flex items-center rounded-full border border-dark px-8 py-2 font-nunito font-normal text-[26px] leading-8 text-dark no-underline transition-colors hover:bg-light-sage/40"
                  aria-label="Purchase intro special 3-session pack"
                >
                  Purchase &gt;
                </Link>
              </div>
            </Card>

            <Card className="p-5 sm:p-7" borderClassName="border-dark" shadowClassName="shadow-[8px_8px_0px_#2f8b5a]">
              <ul className="space-y-7" aria-label="Standard package options">
                {standardPackages.map((item) => (
                  <li
                    key={item.name}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <h3 className="font-ramillas font-black text-dark text-[clamp(40px,4.2vw,56px)] leading-[1.05]">
                        {item.name}
                      </h3>
                      <p className="mt-2 font-nunito font-light text-dark text-[30px] leading-[1.2]">
                        {item.price}
                      </p>
                    </div>

                    <Link
                      href="/#schedule"
                      className="justify-self-start sm:justify-self-end inline-flex items-center rounded-full border border-dark px-8 py-2 font-nunito font-normal text-[26px] leading-8 text-dark no-underline transition-colors hover:bg-light-sage/40"
                      aria-label={`Purchase ${item.name}`}
                    >
                      Purchase &gt;
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
