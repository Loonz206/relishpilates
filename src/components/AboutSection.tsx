export default function AboutSection() {
  return (
    <section
      className="relative w-full pb-16 lg:pb-20"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
      {/* Content pill */}
      <div className="relative overflow-hidden bg-relish-main rounded-tl-[300px] rounded-br-[300px] rounded-tr-sm rounded-bl-sm flex flex-col gap-6 items-center text-center py-12 text-light w-full">
        <div
          className="pointer-events-none absolute left-[50px] top-1/2 hidden -translate-y-1/2 -rotate-[22deg] lg:block"
          aria-hidden="true"
        >
          <svg
            width="160"
            height="180"
            viewBox="0 0 160 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-[150px] w-[132px] opacity-70"
          >
            <path
              d="M77 160C50 132 12 105 12 70C12 51 24 38 40 38C58 38 68 52 77 72C86 52 96 38 114 38C130 38 142 51 142 70C142 105 104 132 77 160Z"
              stroke="#8FA68A"
              strokeWidth="4"
            />
            <path
              d="M77 160C57 140 28 113 28 83C28 66 38 55 51 55C64 55 71 67 77 83C83 67 90 55 103 55C116 55 126 66 126 83C126 113 97 140 77 160Z"
              stroke="#8FA68A"
              strokeWidth="4"
            />
          </svg>
        </div>

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
