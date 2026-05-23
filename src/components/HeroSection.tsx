import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full pb-16 lg:pb-20" aria-labelledby="hero-heading">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-6 lg:px-10 gap-8 relative">
      {/* Copy — columns 1–6 */}
      <div className="flex flex-col gap-8 lg:col-span-6 z-10">
        <h1
          id="hero-heading"
          className="font-ramillas font-black text-dark-pickle leading-[1.25] text-[clamp(40px,5.5vw,80px)] text-balance"
        >
          Yummy, challenging, feel-good Pilates
        </h1>
        <p className="font-nunito font-light text-dark text-lg leading-7 max-w-[540px]">
          Virtual Pilates classes built entirely around you. With custom
          programming and personal attention, every movement connects to how you
          want to move and feel.
          <br />
          <br />
          Join me in building strength, awakening flexibility, and moving
          through life with more freedom and ease.
          <br />
          <br />
          Haven&apos;t tried Pilates before? Welcome!
        </p>
        <Link
          href="#schedule"
          className="self-start bg-lavender border border-dark text-dark font-nunito font-normal text-lg leading-6 px-8 py-2 rounded-full shadow-[6px_6px_0px_#1d1d1f] no-underline motion-safe:hover:translate-x-[1px] motion-safe:hover:translate-y-[1px] motion-safe:hover:shadow-[4px_4px_0px_#1d1d1f] transition-[transform,box-shadow] touch-manipulation"
        >
          Book a session
        </Link>
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
            alt="Relish Pilates welcome"
            fill
            sizes="296px"
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Right column images */}
        <div className="absolute left-[328px] top-[40px] w-[200px] flex flex-col gap-8">
          <div className="relative w-full aspect-[200/250] rounded-2xl overflow-hidden">
            <Image
              src="/images/i-mermaid-1.jpg"
              alt="Pilates mermaid pose"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>
          <div className="relative w-[224px] h-[149px] rounded-2xl overflow-hidden">
            <Image
              src="/images/i-legpullback.jpg"
              alt="Pilates leg pull back"
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
          alt="Relish Pilates welcome"
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
