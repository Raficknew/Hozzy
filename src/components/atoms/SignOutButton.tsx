"use client";
import { Logout05Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export function SignOutButton() {
  const t = useTranslations("SignOut");
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer self-center w-full sm:w-fit">
        <div className="hidden sm:block self-center">
          <HugeiconsIcon
            strokeWidth={2}
            width={20}
            height={20}
            icon={Logout05Icon}
          />
        </div>
        <div
          className={cn(
            "ring w-full sm:hidden",
            buttonVariants({ variant: "ghostDestructive" }),
          )}
        >
          <HugeiconsIcon
            strokeWidth={2}
            width={20}
            height={20}
            icon={Logout05Icon}
          />
          <p>{t("signOut")}</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("titleStart")}{" "}
            <span className="text-red-400">{t("titleHighlight")}</span>?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in");
                  },
                },
              })
            }
          >
            {t("proceed")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
