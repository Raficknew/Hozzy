import { HugeiconsIcon } from "@hugeicons/react";
import { type CategoryIconKeys, icons } from "../types/icons";

export const CategoryIcon = ({
  categoryIconName,
  size = 20,
  color,
}: {
  categoryIconName: CategoryIconKeys;
  size?: number;
  color?: string;
}) => {
  const icon = icons[categoryIconName] || icons.default;
  return <HugeiconsIcon icon={icon} size={size} color={color} />;
};
