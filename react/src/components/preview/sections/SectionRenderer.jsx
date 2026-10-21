import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import CarouselSection from "./CarouselSection";
import TestimonialsSection from "./TestimonialsSection";
import TeamSection from "./TeamSection";
import StatsSection from "./StatsSection";
import CtaSection from "./CtaSection";
import GallerySection from "./GallerySection";
import PricingSection from "./PricingSection";
import FaqSection from "./FaqSection";
import ContactSection from "./ContactSection";
import FooterSection from "./FooterSection";
import SpacerSection from "./SpacerSection";
import CustomAboutSection from "./CustomAboutSection";
import AnimatedHeroSection from "./AnimatedHeroSection";

const MAP = {
  hero: HeroSection,
  about: AboutSection,
  features: FeaturesSection,
  carousel: CarouselSection,
  testimonials: TestimonialsSection,
  team: TeamSection,
  stats: StatsSection,
  cta: CtaSection,
  gallery: GallerySection,
  pricing: PricingSection,
  faq: FaqSection,
  contact: ContactSection,
  footer: FooterSection,
  spacer: SpacerSection,
  customAbout: CustomAboutSection,
  animatedHero: AnimatedHeroSection,
};

export default function SectionRenderer({ section }) {
  const Comp = MAP[section.type];
  if (!Comp) return null;
  return <Comp config={section.config} navId={section.navId} />;
}
