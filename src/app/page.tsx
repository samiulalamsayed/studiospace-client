import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowItWorks from "@/components/home/HowItWorks";
import HostGuarantee from "@/components/home/HostGuarantee";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedStudios />
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}