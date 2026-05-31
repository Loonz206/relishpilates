import type { Metadata } from "next";
import { getFaqPageContent } from "@/lib/cms";
import Card from "@/components/Card";

export async function generateMetadata(): Promise<Metadata> {
  const faqPage = await getFaqPageContent();

  return {
    title: faqPage.metadataTitle,
    description: faqPage.metadataDescription,
  };
}

export default async function FaqPage() {
  const faqPage = await getFaqPageContent();

  return (
    <section className="w-full pb-16 lg:pb-24" aria-labelledby="faq-heading">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 lg:pt-12">
        <h1
          id="faq-heading"
          className="text-center font-ramillas font-black text-dark-pickle text-[clamp(44px,6vw,72px)] leading-[1.1]"
        >
          {faqPage.heading}
        </h1>

        <ul
          className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
          aria-label="Frequently asked questions"
        >
          {faqPage.items.map((item, index) => (
            <li key={`${item.title}-${index}`}>
              <Card
                className="min-h-[190px] p-6 lg:p-8"
                borderClassName="border-dark"
                shadowClassName="shadow-[8px_8px_0px_#8fa68a]"
              >
                <h2 className="font-ramillas font-black text-dark text-[clamp(34px,3vw,46px)] leading-[1.1]">
                  {item.title}
                </h2>
                <p className="mt-5 font-nunito font-light text-dark text-[34px] leading-[1.2]">
                  {item.body}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
