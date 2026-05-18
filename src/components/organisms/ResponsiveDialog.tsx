"use client";

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

export function ResponsiveDialog({
  triggerTitle,
  title,
  children,
  open,
  setIsOpen,
}: {
  triggerTitle: string;
  title: string;
  children: React.ReactNode;
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="default"
              size="lg"
              className="self-center"
            >
              {triggerTitle}
            </Button>
          }
        />
        <DialogContent className="sm:max-w-106.25">
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
      <DrawerTrigger className={buttonVariants({ variant: "default" })}>
        {triggerTitle}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
