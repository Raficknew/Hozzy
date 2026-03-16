"use client";
import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { PageTitle } from "@/components/atoms/PageTitle";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const t = useTranslations("SignInPage");

  const handleSignIn = () => {
    signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <HozzyLogo link variant="withText" size={90} />
      <div className="flex flex-col gap-3 w-full p-5 max-w-112.5 text-center">
        <PageTitle title={t("title")} subtitle={t("subtitle")} />
        <Button variant="submit" onClick={handleSignIn} className="px-3 py-2">
          <HugeiconsIcon strokeWidth={2} icon={GoogleIcon} />
          <p className="font-semibold">{t("google")}</p>
        </Button>
      </div>
    </div>
  );
}
