import { Skeleton } from "@/components/ui/skeleton";

export default function Cargando() {
  return (
    <div aria-busy="true" aria-label="Cargando" className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="mt-2 flex flex-col gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
