import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}

export function CategorySelectSkeleton() {
  return (
    <Card className="w-full md:w-1/3 min-w-[200px]">
      <CardHeader>
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent className="flex gap-4 items-center">
        <Skeleton className="w-[60px] h-[60px] rounded-full" />
        <article className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-16" />
        </article>
      </CardContent>
    </Card>
  );
}
