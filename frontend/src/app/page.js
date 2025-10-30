import FeaturesSection from "@/components/FeaturesSection";
import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen antialiased">
      <Hero />
      <FeaturesSection />
    </div>
  );
}
