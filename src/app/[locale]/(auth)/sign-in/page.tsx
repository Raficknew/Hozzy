import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { PageTitle } from "@/components/atoms/PageTitle";
import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";

export default async function SignInPage() {
  const session = await auth();

  if (session) redirect("/");

  const t = await getTranslations("SignInPage");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <HozzyLogo link variant="withText" size={90} />
      <div className="flex flex-col gap-3 w-full p-5 max-w-[450px] text-center">
        <PageTitle title={t("title")} subtitle={t("subtitle")} />
        <form
          className="flex flex-col gap-3 w-full text-center"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <Button variant="submit" className="px-3 py-2">
            <HugeiconsIcon strokeWidth={2} icon={GoogleIcon} />
            <p className="font-semibold">{t("google")}</p>
          </Button>
        </form>
      </div>
    </div>
  );
}
