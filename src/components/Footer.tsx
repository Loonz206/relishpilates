import Link from "next/link";

const navLinks = [
  { label: "Book Now", href: "#schedule" },
  { label: "Schedule", href: "#schedule" },
  { label: "Pricing", href: "#pricing" },
  { label: "Videos", href: "#videos" },
];

const moreLinks = [
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-light-sage w-full py-12 lg:py-20">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8 px-6 lg:px-10">
      {/* Brand headline */}
      <div className="flex flex-col items-center">
        <p className="font-ramillas font-black text-dark-pickle text-[64px] leading-[80px]">
          Relish Pilates
        </p>
      </div>

      {/* Cards row */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-end w-full">
        {/* Contact form card */}
        <div className="flex-1 bg-light border border-dark rounded-3xl px-6 py-8 shadow-[8px_8px_0px_#1f5534] flex flex-col gap-6">
          <h2 className="font-ramillas font-black text-dark text-2xl leading-9">
            Got questions?
          </h2>
          <form className="flex flex-col gap-4" aria-label="Contact form">
            <label className="flex flex-col gap-1">
              <span className="font-nunito font-normal text-dark text-base leading-6">Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name…"
                className="bg-light-sage rounded-full px-6 py-2 font-nunito font-light text-dark text-base leading-6 border-none outline-none focus-visible:ring-2 focus-visible:ring-dark-pickle"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-nunito font-normal text-dark text-base leading-6">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="you@example.com"
                className="bg-light-sage rounded-full px-6 py-2 font-nunito font-light text-dark text-base leading-6 border-none outline-none focus-visible:ring-2 focus-visible:ring-dark-pickle"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-nunito font-normal text-dark text-base leading-6">What&apos;s on your mind</span>
              <textarea
                name="message"
                autoComplete="off"
                placeholder="Tell me what's on your mind…"
                rows={4}
                className="bg-light-sage rounded-2xl px-6 py-3 font-nunito font-light text-dark text-base leading-6 border-none outline-none focus-visible:ring-2 focus-visible:ring-dark-pickle resize-none"
              />
            </label>
            <button
              type="submit"
              className="self-start bg-lavender border border-dark text-dark font-nunito font-normal text-lg leading-6 px-8 py-2 rounded-full hover:bg-lavender/80 transition-colors cursor-pointer touch-manipulation"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Nav links card */}
        <div className="flex-1 bg-light border border-dark-pickle rounded-3xl px-6 py-8 shadow-[8px_8px_0px_#1f5534]">
          <div className="flex gap-8 font-nunito font-light text-dark-pickle text-lg leading-7">
            <ul className="list-none m-0 p-0 flex flex-col gap-1">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="list-none m-0 p-0 flex flex-col gap-1">
              {moreLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Locations card */}
        <div className="flex-1 px-6 py-8 rounded-3xl flex flex-col">
          <div className="flex flex-col gap-8">
            <h3 className="font-ramillas font-black text-dark text-2xl leading-9">
              Locations
            </h3>
            <div className="font-nunito font-light text-dark-pickle text-lg leading-7 flex flex-col gap-1">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
                aria-label="Instagram"
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
                Instagram
              </Link>
              <p className="mt-4">Streaming from beautiful Bremerton, WA</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
