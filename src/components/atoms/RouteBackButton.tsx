"use client";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export function RouteBackButton() {
  const { back } = useRouter();
  return (
    <button
      type="button"
      className="flex sm:hidden w-10 pl-1"
      onClick={() => back()}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} />
    </button>
  );
}
