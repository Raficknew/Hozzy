"use client";
import { motion } from "motion/react";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <HozzyLogo size={100} variant="default" />
      </motion.div>
    </div>
  );
}
