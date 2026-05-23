import Image from "next/image";

export default function AboutSection() {
  return (
    <section
      className="relative w-full pb-16 lg:pb-20"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
      {/* Decorative leaf graphic */}
      <div
        className="absolute left-[116px] top-[-40px] w-[183px] h-[149px] rotate-[165deg] scale-y-[-1] pointer-events-none"
        aria-hidden="true"
      >
        <Image
          src="/images/graphic-about.png"
          alt=""
          fill
          sizes="183px"
          className="object-contain"
        />
      </div>

      {/* Content pill */}
      <div className="bg-relish-main rounded-tl-[300px] rounded-br-[300px] rounded-tr-sm rounded-bl-sm flex flex-col gap-6 items-center text-center py-12 text-light w-full">
        <h2
          id="about-heading"
          className="font-ramillas font-black text-light text-[clamp(36px,3.5vw,48px)] leading-[1.25] max-w-[800px] text-balance"
        >
          Strengthen. Stretch. Savor.
        </h2>
        <p className="font-nunito font-light text-light text-lg leading-7 max-w-[540px]">
          Relish Pilates is all about sharing movement as a powerful and
          nourishing way to connect to yourself.
          <br />
          <br />
          With a personal guide designing, leading and adapting your workout as
          you move, you get the most out of every moment.
          <br />
          <br />
          And you can have some time that&apos;s truly all about you, what you
          want for your body and how you want to feel in it.
        </p>
      </div>
      </div>
    </section>
  );
}
