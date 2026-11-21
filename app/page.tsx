import { Hero } from "@/components/landing/Hero";
import { SamplePreview } from "@/components/landing/SamplePreview";
import { ClosingCta, Docket, Features, HowItWorks, Parties, TopicMarquee } from "@/components/landing/Sections";
import { getCases } from "@/lib/cases";

export default function Home() {
  return (
    <>
      <Hero />
      <TopicMarquee />
      <SamplePreview />
      <HowItWorks />
      <Parties />
      <Features />
      <Docket cases={getCases()} />
      <ClosingCta />
    </>
  );
}
