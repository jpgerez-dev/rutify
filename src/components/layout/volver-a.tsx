import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

/** Enlace "← Sección" arriba de las páginas internas. */
export function VolverA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-1 mb-3 inline-flex h-9 items-center gap-0.5 rounded-lg pr-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeftIcon className="size-4.5" aria-hidden />
      {children}
    </Link>
  );
}
