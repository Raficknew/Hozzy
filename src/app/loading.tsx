"use client";
import { domAnimation, LazyMotion, m } from "motion/react";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";

export default function Loading() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="w-screen h-screen flex items-center justify-center">
        <m.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <HozzyLogo size={100} variant="default" />
        </m.div>
      </div>
    </LazyMotion>
  );
}
