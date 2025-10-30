"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}

      style={{width: "82%"}}
      className="gradient-hero mx-auto py-12 px-5 md:py-20 rounded-lg mt-1" 
    >
      <div className="max-w-7xl  mx-auto flex flex-col md:flex-row items-center md:justify-between gap-10">
        {/* Text Left */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-xl md:text-2xl font-bold text-white max-w-xl leading-tight">
            Connecting Skilled Craftsmen, Providers, and Companies Seamlessly.
          </p>
          <p className="text-primary-foreground opacity-90 md:text-lg mt-4 max-w-lg">
            Empowering construction hiring through smart job matching and real-time collaboration.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#get-started">
              <button className="btn-primary rounded-full shadow">Get Started</button>
            </a>
            <a href="#learn-more">
              <button className="btn-primary text-white  border-white  rounded-full shadow">Learn More</button>
            </a>
          </div>
        </div>
        {/* Illustration/Image Right */}
        <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0">
          <Image
            src="/craft-hero-placeholder.png"
            alt="Collaboration Illustration"
            width={500}
            height={350}
            className="w-[280px] md:w-[400px] h-auto object-contain pointer-events-none"
            priority
          />
        </div>
      </div>
    </motion.section>
  );
}