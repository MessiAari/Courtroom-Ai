import { Hero } from "@/components/landing/Hero";
import { ClosingCta, Docket, Features, HowItWorks, Parties, TopicMarquee } from "@/components/landing/Sections";
import { getCases } from "@/lib/cases";

export default function Home() {
  return (
    <>
      <Hero />
      <TopicMarquee />
      <HowItWorks />
      <Parties />
      <Features />
      <Docket cases={getCases()} />
      <ClosingCta />
    </>
  );
}
