"use client";
import { Loading02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { domAnimation, LazyMotion, m } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LoadingSwap({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="grid items-center justify-items-center cursor-pointer">
        <div
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2",
            isLoading ? "invisible" : "visible",
          )}
        >
          {children}
        </div>
        <m.div
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2 text-center",
            isLoading ? "visible" : "invisible",
          )}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 1,
          }}
        >
          <HugeiconsIcon icon={Loading02Icon} />
        </m.div>
      </div>
    </LazyMotion>
  );
}
