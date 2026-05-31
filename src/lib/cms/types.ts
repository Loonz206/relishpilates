export interface LinkItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export type CtaLink = LinkItem;

export interface SiteConfigContent {
  brandName: string;
  brandHandle: string;
  metadataTitle: string;
  metadataDescription: string;
}

export interface NavigationMenuContent {
  links: LinkItem[];
  cta: CtaLink;
}

export interface FooterContactBlockContent {
  heading: string;
  formAriaLabel: string;
  fields: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
  primaryLinks: LinkItem[];
  secondaryLinks: LinkItem[];
  locationHeading: string;
  locationBody: string;
  socialLinks: Array<Required<Pick<LinkItem, "label" | "href">> & { ariaLabel: string }>;
}

export interface HeroSectionContent {
  heading: string;
  paragraphs: string[];
  cta: CtaLink;
  images: {
    welcomeAlt: string;
    mermaidAlt: string;
    legPullBackAlt: string;
  };
}

export interface AboutSectionContent {
  heading: string;
  paragraphs: string[];
}

export interface StepItemContent {
  number: string;
  title: string;
  bullets: string[];
}

export interface StepsSectionContent {
  eyebrow: string;
  heading: string;
  cta: CtaLink;
  items: StepItemContent[];
}

export interface HomePageContent {
  metadataTitle: string;
  metadataDescription: string;
  hero: HeroSectionContent;
  about: AboutSectionContent;
  steps: StepsSectionContent;
}

export interface FaqItemContent {
  title: string;
  body: string;
}

export interface FaqPageContent {
  metadataTitle: string;
  metadataDescription: string;
  heading: string;
  items: FaqItemContent[];
}

export interface PricingPackageContent {
  name: string;
  price: string;
  note?: string;
  cta: CtaLink;
}

export interface PricingPageContent {
  metadataTitle: string;
  metadataDescription: string;
  heading: string;
  packagesHeading: string;
  highlights: string[];
  notes: string[];
  faqLink: LinkItem;
  introPackage: PricingPackageContent;
  standardPackages: PricingPackageContent[];
}

export interface ContentContract {
  siteConfig: SiteConfigContent;
  navigationMenu: NavigationMenuContent;
  footerContactBlock: FooterContactBlockContent;
  homePage: HomePageContent;
  faqPage: FaqPageContent;
  pricingPage: PricingPageContent;
}
