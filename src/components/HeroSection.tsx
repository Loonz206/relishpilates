import Image from "next/image";
import { defaultContent } from "@/lib/cms";
import type { HeroSectionContent } from "@/lib/cms";
import Button from "@/components/Button";

interface HeroSectionProps {
  content?: HeroSectionContent;
}

export default function HeroSection({ content = defaultContent.homePage.hero }: HeroSectionProps) {
  return (
    <section className="w-full pb-16 lg:pb-20" aria-labelledby="hero-heading">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-6 lg:px-10 gap-8 relative">
        {/* Copy — columns 1–6 */}
        <div className="flex flex-col gap-8 lg:col-span-6 z-10">
          <h1
            id="hero-heading"
            className="font-ramillas font-black text-dark-pickle leading-[1.25] text-[clamp(40px,5.5vw,80px)] text-balance"
          >
            {content.heading}
          </h1>
          <div className="font-nunito font-light text-dark text-lg leading-7 max-w-[540px]">
            {content.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index > 0 ? "mt-7" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
          <Button href={content.cta.href} className="self-start">
            {content.cta.label}
          </Button>
        </div>

        {/* Media grid — columns 7–12, hidden on small screens */}
        <div className="relative hidden lg:flex lg:col-span-6 h-[471px] justify-end">
          {/* Fixed-width inner wrapper preserves absolute-positioned layout */}
          <div className="relative w-[528px] h-full">
            {/* Background ellipse */}
            <div
              className="absolute left-[41px] top-[40px] w-[491px] h-[491px] rounded-full bg-light-sage"
              aria-hidden="true"
            />

            {/* Video / welcome image */}
            <div className="absolute left-0 top-[80px] w-[296px] h-[299px] rounded-2xl overflow-hidden">
              <Image
                src="/images/i-welcome.gif"
                alt={content.images.welcomeAlt}
                fill
                sizes="296px"
                className="object-cover"
                priority
                loading="eager"
                unoptimized
              />
            </div>

            {/* Right column images */}
            <div className="absolute left-[328px] top-[40px] w-[200px] flex flex-col gap-8">
              <div className="relative w-full aspect-[200/250] rounded-2xl overflow-hidden">
                <Image
                  src="/images/i-mermaid-1.jpg"
                  alt={content.images.mermaidAlt}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="relative w-[224px] h-[149px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/i-legpullback.jpg"
                  alt={content.images.legPullBackAlt}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile image — shown only on small screens */}
        <div className="relative lg:hidden w-full aspect-video rounded-2xl overflow-hidden">
          <Image
            src="/images/i-welcome.gif"
            alt={content.images.welcomeAlt}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
