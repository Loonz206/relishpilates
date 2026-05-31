import { getHomePageContent } from "@/lib/cms";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StepsSection from "@/components/StepsSection";

export default async function Home() {
  const homePage = await getHomePageContent();
  console.log("Home page content:", homePage); // Debug log to verify content <structure></structure>

  return (
    <>
      <HeroSection content={homePage.hero} />
      <AboutSection content={homePage.about} />
      <StepsSection content={homePage.steps} />
    </>
  );
}
