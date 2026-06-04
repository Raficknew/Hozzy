export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="font-normal text-foreground/80">{subtitle}</p>
    </div>
  );
}
