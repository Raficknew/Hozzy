import { User02FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({
  image,
  className,
}: {
  image: string | null | undefined;
  className?: string;
}) {
  return (
    <div className="cursor-pointer flex justify-center">
      <Avatar className={cn("size-8", className)}>
        <AvatarImage src={image ?? undefined} />
        <AvatarFallback className="bg-accent">
          <HugeiconsIcon icon={User02FreeIcons} />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
