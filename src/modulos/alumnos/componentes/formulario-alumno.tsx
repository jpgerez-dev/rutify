"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hoyISO } from "@/lib/fechas";
import { cn } from "@/lib/utils";

import { actualizarAlumno, crearAlumno } from "../acciones";
import {
  ETIQUETAS_NIVEL,
  NIVELES,
  VALORES_INICIALES_ALUMNO,
  esquemaAlumno,
  type DatosAlumno,
} from "../esquemas";

type Props =
  | { modo: "crear"; alumnoId?: undefined; valoresIniciales?: undefined }
  | { modo: "editar"; alumnoId: string; valoresIniciales: DatosAlumno };

export function FormularioAlumno({ modo, alumnoId, valoresIniciales }: Props) {
  const router = useRouter();
  const [pendiente, iniciarTransicion] = useTransition();

  const form = useForm<DatosAlumno>({
    resolver: zodResolver(esquemaAlumno),
    defaultValues: valoresIniciales ?? VALORES_INICIALES_ALUMNO,
    mode: "onTouched",
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((datos) => {
    iniciarTransicion(async () => {
      const resultado =
        modo === "crear" ? await crearAlumno(datos) : await actualizarAlumno(alumnoId, datos);

      if (!resultado.ok) {
        for (const [campo, mensajes] of Object.entries(resultado.erroresCampos ?? {})) {
          if (campo in VALORES_INICIALES_ALUMNO) {
            form.setError(campo as keyof DatosAlumno, { message: mensajes[0] });
          }
        }
        toast.error(resultado.error);
        return;
      }

      toast.success(modo === "crear" ? "Alumno creado." : "Cambios guardados.");
      router.push(`/alumnos/${resultado.datos.id}`);
    });
  });

  const urlCancelar = modo === "crear" ? "/alumnos" : `/alumnos/${alumnoId}`;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <fieldset disabled={pendiente} className="contents">
        <FieldSet>
          <FieldLegend>Datos personales</FieldLegend>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.nombre)}>
                <FieldLabel htmlFor="nombre">Nombre *</FieldLabel>
                <Input
                  id="nombre"
                  autoComplete="off"
                  autoCapitalize="words"
                  aria-invalid={Boolean(errors.nombre)}
                  {...form.register("nombre")}
                />
                <FieldError errors={[errors.nombre]} />
              </Field>
              <Field data-invalid={Boolean(errors.apellido)}>
                <FieldLabel htmlFor="apellido">Apellido *</FieldLabel>
                <Input
                  id="apellido"
                  autoComplete="off"
                  autoCapitalize="words"
                  aria-invalid={Boolean(errors.apellido)}
                  {...form.register("apellido")}
                />
                <FieldError errors={[errors.apellido]} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.telefono)}>
                <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
                <Input
                  id="telefono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  placeholder="381 555 1234"
                  aria-invalid={Boolean(errors.telefono)}
                  {...form.register("telefono")}
                />
                <FieldDescription>Con código de área, sin 0 ni 15. Se usa para WhatsApp.</FieldDescription>
                <FieldError errors={[errors.telefono]} />
              </Field>
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.email)}
                  {...form.register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.fecha_nacimiento)} className="sm:max-w-xs">
              <FieldLabel htmlFor="fecha_nacimiento">Fecha de nacimiento</FieldLabel>
              <Input
                id="fecha_nacimiento"
                type="date"
                min="1900-01-01"
                max={hoyISO()}
                aria-invalid={Boolean(errors.fecha_nacimiento)}
                {...form.register("fecha_nacimiento")}
              />
              <FieldError errors={[errors.fecha_nacimiento]} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Entrenamiento</FieldLegend>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.objetivo)}>
              <FieldLabel htmlFor="objetivo">Objetivo</FieldLabel>
              <Textarea
                id="objetivo"
                rows={2}
                placeholder="Ej.: hipertrofia de tren inferior, bajar 5 kg…"
                aria-invalid={Boolean(errors.objetivo)}
                {...form.register("objetivo")}
              />
              <FieldError errors={[errors.objetivo]} />
            </Field>

            <Field data-invalid={Boolean(errors.nivel)}>
              <FieldLabel id="nivel-etiqueta">Nivel</FieldLabel>
              <Controller
                control={form.control}
                name="nivel"
                render={({ field }) => (
                  <div
                    role="radiogroup"
                    aria-labelledby="nivel-etiqueta"
                    className="grid grid-cols-3 gap-2"
                  >
                    {NIVELES.map((nivel) => {
                      const seleccionado = field.value === nivel;
                      return (
                        <button
                          key={nivel}
                          type="button"
                          role="radio"
                          aria-checked={seleccionado}
                          onClick={() => field.onChange(seleccionado ? "" : nivel)}
                          className={cn(
                            "h-11 rounded-lg border px-2 text-sm font-medium transition-colors md:h-9",
                            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                            seleccionado
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-transparent hover:bg-muted",
                          )}
                        >
                          {ETIQUETAS_NIVEL[nivel]}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <FieldDescription>Tocá de nuevo para dejarlo sin definir.</FieldDescription>
              <FieldError errors={[errors.nivel]} />
            </Field>

            <Field data-invalid={Boolean(errors.lesiones_limitaciones)}>
              <FieldLabel htmlFor="lesiones_limitaciones">Lesiones o limitaciones</FieldLabel>
              <Textarea
                id="lesiones_limitaciones"
                rows={2}
                placeholder="Ej.: dolor lumbar, operación de rodilla derecha (2023)…"
                aria-invalid={Boolean(errors.lesiones_limitaciones)}
                {...form.register("lesiones_limitaciones")}
              />
              <FieldError errors={[errors.lesiones_limitaciones]} />
            </Field>

            <Field data-invalid={Boolean(errors.notas)}>
              <FieldLabel htmlFor="notas">Notas</FieldLabel>
              <Textarea
                id="notas"
                rows={3}
                aria-invalid={Boolean(errors.notas)}
                {...form.register("notas")}
              />
              <FieldError errors={[errors.notas]} />
            </Field>
          </FieldGroup>
        </FieldSet>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg" asChild>
          <Link href={urlCancelar} aria-disabled={pendiente}>
            Cancelar
          </Link>
        </Button>
        <Button type="submit" size="lg" disabled={pendiente} className="sm:min-w-40">
          {pendiente && <Loader2Icon className="animate-spin" />}
          {pendiente ? "Guardando…" : modo === "crear" ? "Crear alumno" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
