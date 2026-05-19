export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="md:text-xl sm:text-lg text-xs text-muted-foreground sm:text-white font-medium">
        {title}
      </h2>
      <h4 className="hidden md:block text-xs text-muted-foreground">
        {description}
      </h4>
    </div>
  );
}
