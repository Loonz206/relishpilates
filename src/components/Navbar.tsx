import Link from "next/link";
import { defaultContent } from "@/lib/cms";
import type { NavigationMenuContent, SiteConfigContent } from "@/lib/cms";

interface NavbarProps {
  navigationMenu?: NavigationMenuContent;
  siteConfig?: SiteConfigContent;
}

export default function Navbar({
  navigationMenu = defaultContent.navigationMenu,
  siteConfig = defaultContent.siteConfig,
}: NavbarProps) {
  return (
    <header className="w-full pt-4 pb-8 lg:pb-12">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <nav
          className="flex items-center justify-between w-full bg-dark-pickle rounded-full px-10 py-3"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-ramillas font-black text-light text-3xl leading-10 whitespace-nowrap no-underline"
          >
            {siteConfig.brandHandle}
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Nav links */}
            <ul className="hidden md:flex items-center gap-4 list-none m-0 p-0">
              {navigationMenu.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-nunito font-normal text-light text-lg leading-6 px-2 py-1 rounded hover:underline transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <Link
              href={navigationMenu.cta.href}
              className="bg-lavender border border-dark text-dark font-nunito font-normal text-lg leading-6 px-4 py-2 rounded-full whitespace-nowrap no-underline hover:bg-lavender/80 transition-colors touch-manipulation"
            >
              {navigationMenu.cta.label}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
