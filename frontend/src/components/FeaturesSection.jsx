"use client";
import { Building, Users, Wrench, Settings } from "lucide-react";

const features = [
  {
    icon: <Building className="w-8 h-8 text-brand-purple" />,
    title: "For Companies",
    description:
      "Post jobs and hire skilled craftsmen faster. Streamline your construction hiring with ease and efficiency.",
  },
  {
    icon: <Users className="w-8 h-8 text-brand-blue" />,
    title: "For Providers",
    description:
      "Manage teams, assign craftsmen, and track work progress in one dashboard. Simple and transparent.",
  },
  {
    icon: <Wrench className="w-8 h-8 text-amber-500" />,
    title: "For Craftsmen",
    description:
      "Get matched with jobs that fit your skills and location. Grow your career with better opportunities.",
  },
  {
    icon: <Settings className="w-8 h-8 text-green-600" />,
    title: "Smart Matching",
    description:
      "Automated job-craft matching with geo-based filtering for optimal results every time.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-background py-12 px-3 md:py-16 antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-2xl mx-auto">
            Simplifying job hiring and workforce management for the construction industry.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center rounded-lg bg-card text-card-foreground border border-border shadow p-7 hover:shadow-lg transition-shadow duration-300 group"
            >
              <span className="mb-3 inline-flex items-center justify-center bg-accent rounded-full w-14 h-14 group-hover:scale-110 transition-transform">
                {feature.icon}
              </span>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}