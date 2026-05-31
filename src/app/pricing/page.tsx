import type { Metadata } from "next";
import Link from "next/link";
import { getPricingPageContent } from "@/lib/cms";
import Card from "@/components/Card";

export async function generateMetadata(): Promise<Metadata> {
  const pricingPage = await getPricingPageContent();

  return {
    title: pricingPage.metadataTitle,
    description: pricingPage.metadataDescription,
  };
}

export default async function PricingPage() {
  const pricingPage = await getPricingPageContent();

  return (
    <section className="w-full pb-16 lg:pb-24" aria-labelledby="pricing-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="pt-8 lg:pt-12">
          <h1
            id="pricing-heading"
            className="text-center font-ramillas font-black text-dark-pickle text-[clamp(44px,6vw,72px)] leading-[1.1]"
          >
            {pricingPage.heading}
          </h1>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="font-ramillas font-black text-dark text-[clamp(44px,5vw,60px)] leading-[1.05]">
              {pricingPage.packagesHeading}
            </h2>

            <ul className="mt-6 space-y-4 text-center lg:text-left">
              {pricingPage.highlights.map((line) => (
                <li
                  key={line}
                  className="font-nunito font-light text-dark text-[28px] leading-[1.25]"
                >
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center lg:text-left">
              {pricingPage.notes.map((note) => (
                <p key={note} className="font-nunito font-light italic text-dark text-xl leading-8">
                  {note}
                </p>
              ))}
              <Link
                href={pricingPage.faqLink.href}
                className="mt-5 inline-block font-nunito text-xl leading-8 underline text-[#6d59e5]"
              >
                {pricingPage.faqLink.label}
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
                    {pricingPage.introPackage.name.split("\n").map((line, index, lines) => (
                      <span key={line}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h3>
                  <p className="mt-3 font-nunito font-light text-dark text-[30px] leading-[1.2]">
                    {pricingPage.introPackage.price}
                  </p>
                  {pricingPage.introPackage.note ? (
                    <p className="mt-1 font-nunito font-light italic text-dark text-[28px] leading-[1.2]">
                      {pricingPage.introPackage.note}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={pricingPage.introPackage.cta.href}
                  className="justify-self-start sm:justify-self-end inline-flex items-center rounded-full border border-dark px-8 py-2 font-nunito font-normal text-[26px] leading-8 text-dark no-underline transition-colors hover:bg-light-sage/40"
                  aria-label={pricingPage.introPackage.cta.ariaLabel}
                >
                  {pricingPage.introPackage.cta.label}
                </Link>
              </div>
            </Card>

            <Card
              className="p-5 sm:p-7"
              borderClassName="border-dark"
              shadowClassName="shadow-[8px_8px_0px_#2f8b5a]"
            >
              <ul className="space-y-7" aria-label="Standard package options">
                {pricingPage.standardPackages.map((item) => (
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
                      href={item.cta.href}
                      className="justify-self-start sm:justify-self-end inline-flex items-center rounded-full border border-dark px-8 py-2 font-nunito font-normal text-[26px] leading-8 text-dark no-underline transition-colors hover:bg-light-sage/40"
                      aria-label={item.cta.ariaLabel ?? `Purchase ${item.name}`}
                    >
                      {item.cta.label}
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
