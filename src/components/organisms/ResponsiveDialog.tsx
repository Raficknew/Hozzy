"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

export function ResponsiveDialog({
  icon,
  buttonVariant = "default",
  mobileButtonVariant,
  hideTriggerTitleOnMobile = false,
  triggerTestId,
  mobileTriggerClassName,
  testId,
  triggerTitle,
  title,
  children,
  open,
  setIsOpen,
}: {
  icon: IconSvgElement;
  testId: string;
  buttonVariant?: "default" | "outline";
  mobileButtonVariant?: "default" | "outline";
  hideTriggerTitleOnMobile?: boolean;
  triggerTestId?: string;
  mobileTriggerClassName?: string;
  triggerTitle?: string;
  title: string;
  children: React.ReactNode;
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const resolvedMobileButtonVariant = mobileButtonVariant ?? buttonVariant;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant={buttonVariant}
              size="lg"
              className="self-center gap-2"
              data-testid={triggerTestId}
            >
              <HugeiconsIcon size={20} icon={icon} />
              {triggerTitle}
            </Button>
          }
        />
        <DialogContent className="sm:max-w-106.25" data-testid={testId}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerTrigger
        className={cn(
          buttonVariants({ variant: resolvedMobileButtonVariant, size: "lg" }),
          "gap-1",
          mobileTriggerClassName,
        )}
        data-testid={triggerTestId}
      >
        <HugeiconsIcon size={20} icon={icon} />
        {!hideTriggerTitleOnMobile && triggerTitle}
      </DrawerTrigger>
      <DrawerContent data-testid={testId}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
