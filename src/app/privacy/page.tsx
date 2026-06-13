import type { Metadata } from "next";
import Card from "@/components/Card";

export const metadata: Metadata = {
  title: "Privacy Policy | Relish Pilates",
  description: "Relish Pilates privacy policy and data protection information.",
};

export default function PrivacyPage() {
  const policies = [
    {
      title: "Information We Collect",
      body: "We collect information you provide directly to us, such as when you book a session or fill out our contact form. This includes your name, email address, and any fitness information relevant to your Pilates sessions.",
    },
    {
      title: "How We Use Your Information",
      body: "We use your information to provide and improve our services, communicate with you about your sessions, and send you updates about new offerings. We never share your personal information with third parties without your consent.",
    },
    {
      title: "Data Security",
      body: "We take data security seriously and implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
    },
    {
      title: "Your Rights",
      body: "You have the right to access, correct, or delete your personal information at any time. If you have questions about how we handle your data, please contact us at our email or phone number listed on our website.",
    },
    {
      title: "Cookies and Tracking",
      body: "Our website may use cookies to improve your user experience. These are small files stored on your device that help us understand how you interact with our site. You can disable cookies in your browser settings if you prefer.",
    },
    {
      title: "Changes to This Policy",
      body: "We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website.",
    },
  ];

  return (
    <section className="w-full pb-16 lg:pb-24" aria-labelledby="privacy-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-8 lg:pt-12">
        <h1
          id="privacy-heading"
          className="text-center font-ramillas font-black text-dark-pickle text-[clamp(44px,6vw,72px)] leading-[1.1]"
        >
          Privacy Policy
        </h1>

        <ul
          className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
          aria-label="Privacy policy sections"
        >
          {policies.map((policy, index) => (
            <li key={`${policy.title}-${index}`}>
              <Card
                className="min-h-[190px] p-6 lg:p-8"
                borderClassName="border-dark"
                shadowClassName="shadow-[8px_8px_0px_#8fa68a]"
              >
                <h2 className="font-ramillas font-black text-dark text-[clamp(34px,3vw,46px)] leading-[1.1]">
                  {policy.title}
                </h2>
                <p className="mt-5 font-nunito font-light text-dark text-[34px] leading-[1.2]">
                  {policy.body}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
