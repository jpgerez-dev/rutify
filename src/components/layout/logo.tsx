import { DumbbellIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <DumbbellIcon className="size-4.5" aria-hidden />
      </span>
      <span className="text-lg">Rutify</span>
    </span>
  );
}
