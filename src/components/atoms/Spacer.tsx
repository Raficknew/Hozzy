import { cn } from "@/lib/utils";

export function Spacer({ color = "bg-muted-foreground" }: { color?: string }) {
  return (
    <div className={cn("md:w-full md:h-px h-0 w-0 rounded-sm", color)}></div>
  );
}
