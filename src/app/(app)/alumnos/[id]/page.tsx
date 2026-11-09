import { MailIcon, MessageCircleIcon, PhoneIcon, TriangleAlertIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VolverA } from "@/components/layout/volver-a";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calcularEdad, formatearFecha } from "@/lib/fechas";
import { enlaceLlamada, enlaceWhatsApp } from "@/lib/telefono";
import { iniciales } from "@/lib/texto";
import { cn } from "@/lib/utils";
import { AccionesAlumno } from "@/modulos/alumnos/componentes/acciones-alumno";
import { contarRutinasDeAlumno, obtenerAlumno } from "@/modulos/alumnos/consultas";
import { etiquetaNivel } from "@/modulos/alumnos/esquemas";

export async function generateMetadata(props: PageProps<"/alumnos/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const alumno = await obtenerAlumno(id);
  return { title: alumno ? `${alumno.nombre} ${alumno.apellido}` : "Alumno" };
}

function Seccion({
  titulo,
  children,
  className,
}: {
  titulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border bg-card p-4 sm:p-5", className)}>
      <h2 className="mb-2 text-sm font-medium text-muted-foreground">{titulo}</h2>
      {children}
    </section>
  );
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm not-last:border-b">
      <dt className="text-muted-foreground">{etiqueta}</dt>
      <dd className="min-w-0 text-right font-medium break-words">{children}</dd>
    </div>
  );
}

const SIN_DATO = <span className="font-normal text-muted-foreground">Sin cargar</span>;

export default async function PaginaAlumno(props: PageProps<"/alumnos/[id]">) {
  const { id } = await props.params;
  const alumno = await obtenerAlumno(id);
  if (!alumno) notFound();

  const cantidadRutinas = await contarRutinasDeAlumno(id);
  const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`;
  const nivel = etiquetaNivel(alumno.nivel);
  const edad = calcularEdad(alumno.fecha_nacimiento);
  const whatsapp = enlaceWhatsApp(alumno.telefono, `Hola ${alumno.nombre}!`);
  const llamada = enlaceLlamada(alumno.telefono);

  return (
    <div className="mx-auto max-w-3xl">
      <VolverA href="/alumnos">Alumnos</VolverA>

      <header className="mb-5 flex flex-wrap items-center gap-4">
        <span
          aria-hidden
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-full text-lg font-semibold",
            alumno.activo ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {iniciales(alumno.nombre, alumno.apellido)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight break-words">{nombreCompleto}</h1>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {!alumno.activo && <Badge variant="outline">Inactivo</Badge>}
            {nivel && <Badge variant="secondary">{nivel}</Badge>}
            {edad !== null && <Badge variant="secondary">{edad} años</Badge>}
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto [&>a:first-child]:flex-1 sm:[&>a:first-child]:flex-none">
          <AccionesAlumno
            alumnoId={alumno.id}
            nombreCompleto={nombreCompleto}
            activo={alumno.activo}
            cantidadRutinas={cantidadRutinas}
          />
        </div>
      </header>

      {(whatsapp || llamada || alumno.email) && (
        <div className="mb-5 grid grid-cols-2 gap-2 sm:flex">
          {whatsapp && (
            <Button asChild variant="secondary">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircleIcon /> WhatsApp
              </a>
            </Button>
          )}
          {llamada && (
            <Button asChild variant="secondary">
              <a href={llamada}>
                <PhoneIcon /> Llamar
              </a>
            </Button>
          )}
          {alumno.email && (
            <Button asChild variant="secondary" className="col-span-2 sm:col-span-1">
              <a href={`mailto:${alumno.email}`}>
                <MailIcon /> Email
              </a>
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Seccion titulo="Datos">
          <dl>
            <Dato etiqueta="Teléfono">{alumno.telefono ?? SIN_DATO}</Dato>
            <Dato etiqueta="Email">{alumno.email ?? SIN_DATO}</Dato>
            <Dato etiqueta="Nacimiento">
              {alumno.fecha_nacimiento ? formatearFecha(alumno.fecha_nacimiento) : SIN_DATO}
            </Dato>
            <Dato etiqueta="Alumno desde">{formatearFecha(alumno.created_at)}</Dato>
          </dl>
        </Seccion>

        <Seccion titulo="Objetivo">
          {alumno.objetivo ? (
            <p className="text-sm whitespace-pre-wrap">{alumno.objetivo}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Sin cargar</p>
          )}
        </Seccion>

        <Seccion
          titulo="Lesiones o limitaciones"
          className={cn(
            alumno.lesiones_limitaciones &&
              "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
          )}
        >
          {alumno.lesiones_limitaciones ? (
            <p className="flex gap-2 text-sm whitespace-pre-wrap">
              <TriangleAlertIcon
                className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden
              />
              <span>{alumno.lesiones_limitaciones}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Ninguna registrada</p>
          )}
        </Seccion>

        <Seccion titulo="Notas">
          {alumno.notas ? (
            <p className="text-sm whitespace-pre-wrap">{alumno.notas}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Sin notas</p>
          )}
        </Seccion>
      </div>
    </div>
  );
}
