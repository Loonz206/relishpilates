import type { Metadata } from "next";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "Terms of Service | Relish Pilates",
  description: "Relish Pilates terms of service and conditions for using our platform.",
};

export default function TermsPage() {
  const terms = [
    {
      title: "Acceptance of Terms",
      body: "By booking a session or using our website, you agree to these terms and conditions. If you do not agree with any part of these terms, you may not use our services.",
    },
    {
      title: "Session Cancellation & Rescheduling",
      body: "You may reschedule or cancel your session with at least 24 hours notice. Cancellations made less than 24 hours before your scheduled session may result in forfeiture of that session. No refunds are provided for cancellations outside the rescheduling window.",
    },
    {
      title: "Session Packages",
      body: "Session packages expire 6 months from the purchase date. Unused sessions after the expiration date will be forfeited. Session pricing does not include applicable taxes. All prices are subject to change without notice.",
    },
    {
      title: "Assumption of Risk",
      body: "Pilates is a physical activity. You acknowledge that participating in our sessions involves inherent risks. You assume all risks associated with your participation and agree to release Relish Pilates from any liability for injuries or damages.",
    },
    {
      title: "Medical Consultation",
      body: "Before starting any new exercise program, including Pilates, consult with a healthcare professional if you have any pre-existing medical conditions, injuries, or concerns. Relish Pilates is not a substitute for medical advice.",
    },
    {
      title: "Liability Limitation",
      body: "Relish Pilates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our liability is limited to the amount you paid for your sessions.",
    },
    {
      title: "User Conduct",
      body: "You agree to use our services in compliance with all applicable laws and regulations. You will not engage in any conduct that is harmful, threatening, abusive, or otherwise violates the rights of others.",
    },
    {
      title: "Changes to Terms",
      body: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of any modifications.",
    },
  ];

  return (
    <section className="w-full pb-16 lg:pb-24" aria-labelledby="terms-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-8 lg:pt-12">
        <h1
          id="terms-heading"
          className="text-center font-ramillas font-black text-dark-pickle text-[clamp(44px,6vw,72px)] leading-[1.1]"
        >
          Terms of Service
        </h1>

        <ul
          className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
          aria-label="Terms of service sections"
        >
          {terms.map((term, index) => (
            <li key={`${term.title}-${index}`}>
              <Card
                className="min-h-[190px] p-6 lg:p-8"
                borderClassName="border-dark"
                shadowClassName="shadow-[8px_8px_0px_#8fa68a]"
              >
                <h2 className="font-ramillas font-black text-dark text-[clamp(34px,3vw,46px)] leading-[1.1]">
                  {term.title}
                </h2>
                <p className="mt-5 font-nunito font-light text-dark text-[34px] leading-[1.2]">
                  {term.body}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
