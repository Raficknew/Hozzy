import Image from "next/image";
import Link from "next/link";

const HozzyLogoVariants = {
  default: "/images/HozzyPurpleAvatar.svg",
  white: "/images/HozzyAvatar.svg",
  withText: "/images/HozzyLogoWithText.svg",
} as const;

export function HozzyLogo({
  size = 30,
  variant = "default",
  link = false,
}: {
  size?: number;
  variant?: keyof typeof HozzyLogoVariants;
  link?: boolean;
}) {
  if (link) {
    return (
      <Link
        className={
          variant === "withText" ? "fixed sm:top-0 top-8 sm:left-8" : ""
        }
        style={{
          width: size,
          height: size,
        }}
        href="/"
      >
        <HozzyImage variant={variant} size={size} />
      </Link>
    );
  }

  return <HozzyImage variant={variant} size={size} />;
}

function HozzyImage({
  variant,
  size,
}: {
  variant: keyof typeof HozzyLogoVariants;
  size: number;
}) {
  return (
    <Image
      className={variant === "withText" ? "fixed top-8 sm:left-8" : ""}
      src={HozzyLogoVariants[variant]}
      alt="logo"
      width={size}
      height={size}
    />
  );
}
