"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { HozzyLogo } from "@/components/atoms/HozzyLogo";
import { LanguageSelect } from "@/components/atoms/LanguageSelect";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroPage() {
  const locale = useLocale();
  const t = useTranslations("HeroPage");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <HozzyLogo link variant="withText" size={90} />

      <LanguageSelect
        currentLocale={locale}
        className="fixed top-18 sm:top-7.5 sm:right-8"
      />

      <div className="flex flex-col items-center justify-between h-full pt-40 xl:w-[1280px] lg:w-[1024px] md:w-[768px] sm:w-[540px] w-full px-3">
        <div className="flex flex-col xl:text-6xl lg:text-5xl md:text-4xl sm:text-2xl  text-xl font-semibold sm:text-start text-center">
          <motion.h1
            className="text-[#BDB6FC]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
          >
            {t("firstTerm")}
          </motion.h1>
          <motion.h1
            className="sm:self-start self-center sm:indent-15 bg-linear-to-r from-[#7047EB] to-[#BDB6FC] bg-clip-text text-transparent w-fit inline-block leading-[1.4] align-text-bottom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.4 }}
          >
            {t("secondTerm")}
          </motion.h1>

          <div className="flex flex-col sm:gap-2 gap-4">
            <motion.h1
              className="text-[#7047EB] sm:indent-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.6 }}
            >
              {t("thirdTerm")}
            </motion.h1>

            <div className="sm:text-end text-center flex flex-col sm:gap-2 gap-4 lg:text-base md:text-sm text-xs font-normal">
              <motion.h2
                className="text-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut", delay: 0.8 }}
              >
                {t("description")}
              </motion.h2>

              <motion.div
                className="flex sm:self-end self-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: "circInOut",
                  delay: 1.0,
                }}
              >
                <Link
                  className={cn(buttonVariants({ variant: "submit" }))}
                  href={`/sign-in`}
                >
                  {t("join")}
                  <HugeiconsIcon strokeWidth={3} icon={ArrowRight01Icon} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        <HozzyHeroImage />
        <HozzyHeroImageMobile />
      </div>
    </div>
  );
}

function HozzyHeroImage() {
  return (
    <div className="relative hidden md:flex justify-center items-end w-full">
      <motion.div
        className="absolute left-20 bottom-0 z-0 xl:w-[800px] lg:w-[600px] md:w-[450px] max-h-[60vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
      >
        <Image
          src="/images/HozzyTransactionImage.webp"
          alt="TransactionChart"
          width={800}
          height={800}
        />
      </motion.div>
      <motion.div
        className="relative z-10 xl:w-[500px] lg:w-[400px] md:w-[300px] max-h-[50vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
      >
        <Image
          src="/images/HozzyBalanceImage.webp"
          alt="Balance"
          width={500}
          height={500}
        />
      </motion.div>
      <motion.div
        className="absolute right-15 bottom-0 z-5 xl:w-[700px] lg:w-[500px] md:w-[400px] max-h-[55vh]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
      >
        <Image
          src="/images/HozzyIncomeChart.webp"
          alt="IncomeChart"
          width={700}
          height={700}
        />
      </motion.div>
      <motion.div
        className="fixed bottom-0 -z-10"
        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src="/images/HozzyCircle.svg"
          alt="circle"
          width={1500}
          height={1500}
        />
      </motion.div>
    </div>
  );
}

function HozzyHeroImageMobile() {
  return (
    <div className="relative md:hidden flex justify-center items-end w-full">
      <motion.div
        className="absolute left-[-22px] bottom-55"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
      >
        <Image
          className="rounded-l-xl"
          src="/images/HozzyExpensesImage.webp"
          alt="TransactionChart"
          width={300}
          height={300}
        />
      </motion.div>
      <motion.div
        className="fixed z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
      >
        <Image
          src="/images/HozzyBalanceSmallImage.webp"
          alt="Balance"
          width={300}
          height={300}
        />
      </motion.div>
      <motion.div
        className="absolute right-[-22px] bottom-45"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
      >
        <Image
          className="rounded-r-xl"
          src="/images/HozzyIncomeImage.webp"
          alt="IncomeChart"
          width={300}
          height={300}
        />
      </motion.div>
      <motion.div
        className="fixed top-120 -z-10"
        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src="/images/HozzyMobileCircle.svg"
          alt="circle"
          width={1200}
          height={1200}
        />
      </motion.div>
    </div>
  );
}
