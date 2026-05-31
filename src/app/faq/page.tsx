import type { Metadata } from "next";
import Card from "@/components/Card";

const faqItems = [
  {
    title: "FAQ title",
    body: "Paragraph 1 body copy",
  },
  {
    title: "FAQ title",
    body: "Paragraph 1 body copy",
  },
];

export const metadata: Metadata = {
  title: "FAQ | Relish Pilates",
  description: "Find answers to common questions about Relish Pilates sessions and scheduling.",
};

export default function FaqPage() {
  return (
    <section className="w-full pb-16 lg:pb-24" aria-labelledby="faq-heading">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 lg:pt-12">
        <h1
          id="faq-heading"
          className="text-center font-ramillas font-black text-dark-pickle text-[clamp(44px,6vw,72px)] leading-[1.1]"
        >
          Frequently Asked Questions
        </h1>

        <ul className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2" aria-label="Frequently asked questions">
          {faqItems.map((item, index) => (
            <li key={`${item.title}-${index}`}>
              <Card
                className="min-h-[190px] p-6 lg:p-8"
                borderClassName="border-dark"
                shadowClassName="shadow-[8px_8px_0px_#8fa68a]"
              >
                <h2 className="font-ramillas font-black text-dark text-[clamp(34px,3vw,46px)] leading-[1.1]">
                  {item.title}
                </h2>
                <p className="mt-5 font-nunito font-light text-dark text-[34px] leading-[1.2]">{item.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}