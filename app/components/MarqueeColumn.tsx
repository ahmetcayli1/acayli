"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const MarqueeColumn = ({ images, direction = "up" }: { images: string[], direction?: "up" | "down" }) => {
  return (
    <div className="h-[120vh] -my-[10vh] overflow-hidden relative w-full opacity-50 hover:opacity-100 transition-opacity duration-500">
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === "up" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: "linear",
        }}
      >
        {/* Duplicate images to create seamless loop */}
        {[...images, ...images, ...images].map((src, idx) => (
          <div key={idx} className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={src}
              alt="City"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
