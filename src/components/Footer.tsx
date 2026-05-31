import Link from "next/link";
import { defaultContent } from "@/lib/cms";
import type { FooterContactBlockContent, SiteConfigContent } from "@/lib/cms";
import Button from "@/components/Button";
import Card from "@/components/Card";

interface FooterProps {
  footerContactBlock?: FooterContactBlockContent;
  siteConfig?: SiteConfigContent;
}

export default function Footer({
  footerContactBlock = defaultContent.footerContactBlock,
  siteConfig = defaultContent.siteConfig,
}: FooterProps) {
  return (
    <footer className="w-full">
      <div className="relative h-20 w-full bg-light" aria-hidden="true">
        <svg
          className="absolute inset-x-0 bottom-0 h-full w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 45C25 45 35 18 58 18C82 18 90 55 120 55C150 55 165 18 195 18C225 18 230 76 260 76C288 76 298 18 330 18C362 18 375 45 415 45C450 45 470 18 505 18C540 18 548 55 578 55C610 55 620 18 650 18C678 18 690 76 720 76C750 76 760 18 790 18C820 18 835 45 865 45C897 45 910 18 940 18C970 18 980 55 1010 55C1040 55 1050 18 1080 18C1110 18 1125 45 1155 45C1175 45 1188 40 1200 40V120H0V45Z"
            fill="#c5ccba"
          />
        </svg>
      </div>

      <div className="bg-light-sage py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 px-6 lg:px-10">
          {/* Brand headline */}
          <div className="flex flex-col items-center">
            <p className="font-ramillas font-black text-dark-pickle text-[64px] leading-[80px]">
              {siteConfig.brandName}
            </p>
          </div>

          {/* Cards row */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end w-full">
            {/* Contact form card */}
            <Card className="flex-1 flex flex-col gap-6" borderClassName="border-dark">
              <h2 className="font-ramillas font-black text-dark text-2xl leading-9">
                {footerContactBlock.heading}
              </h2>
              <form className="flex flex-col gap-4" aria-label={footerContactBlock.formAriaLabel}>
                <label className="flex flex-col gap-1" suppressHydrationWarning>
                  <span className="font-nunito font-normal text-dark text-base leading-6">
                    {footerContactBlock.fields.nameLabel}
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder={footerContactBlock.fields.namePlaceholder}
                    className="bg-light-sage rounded-full px-6 py-2 font-nunito font-light text-dark text-base leading-6 border-none outline-none focus-visible:ring-2 focus-visible:ring-dark-pickle"
                  />
                </label>
                <label className="flex flex-col gap-1" suppressHydrationWarning>
                  <span className="font-nunito font-normal text-dark text-base leading-6">
                    {footerContactBlock.fields.emailLabel}
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder={footerContactBlock.fields.emailPlaceholder}
                    className="bg-light-sage rounded-full px-6 py-2 font-nunito font-light text-dark text-base leading-6 border-none outline-none focus-visible:ring-2 focus-visible:ring-dark-pickle"
                  />
                </label>
                <label className="flex flex-col gap-1" suppressHydrationWarning>
                  <span className="font-nunito font-normal text-dark text-base leading-6">
                    {footerContactBlock.fields.messageLabel}
                  </span>
                  <textarea
                    name="message"
                    autoComplete="off"
                    placeholder={footerContactBlock.fields.messagePlaceholder}
                    rows={4}
                    className="bg-light-sage rounded-2xl px-6 py-3 font-nunito font-light text-dark text-base leading-6 border-none outline-none focus-visible:ring-2 focus-visible:ring-dark-pickle resize-none"
                  />
                </label>
                <Button type="submit" className="self-start cursor-pointer">
                  {footerContactBlock.fields.submitLabel}
                </Button>
              </form>
            </Card>

            {/* Nav links card */}
            <Card className="flex-1" borderClassName="border-dark-pickle">
              <div className="flex gap-8 font-nunito font-light text-dark-pickle text-lg leading-7">
                <ul className="list-none m-0 p-0 flex flex-col gap-1">
                  {footerContactBlock.primaryLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="hover:underline">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="list-none m-0 p-0 flex flex-col gap-1">
                  {footerContactBlock.secondaryLinks.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="hover:underline">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Locations card */}
            <div className="flex-1 px-6 py-8 rounded-3xl flex flex-col">
              <div className="flex flex-col gap-8">
                <h3 className="font-ramillas font-black text-dark text-2xl leading-9">
                  {footerContactBlock.locationHeading}
                </h3>
                <div className="font-nunito font-light text-dark-pickle text-lg leading-7 flex flex-col gap-1">
                  <Link
                    href={footerContactBlock.socialLinks[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                    aria-label={footerContactBlock.socialLinks[0].ariaLabel}
                  >
                    {/* Instagram icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    {footerContactBlock.socialLinks[0].label}
                  </Link>
                  <p className="mt-4">{footerContactBlock.locationBody}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
