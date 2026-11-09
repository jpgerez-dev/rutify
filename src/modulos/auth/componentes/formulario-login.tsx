"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { iniciarSesion } from "../acciones";
import { esquemaLogin, type DatosLogin } from "../esquemas";

export function FormularioLogin() {
  const [pendiente, iniciarTransicion] = useTransition();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const form = useForm<DatosLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((datos) => {
    setErrorGeneral(null);
    iniciarTransicion(async () => {
      const resultado = await iniciarSesion(datos);
      // Si sale bien, la acción redirige y no vuelve acá.
      if (resultado && !resultado.ok) {
        setErrorGeneral(resultado.error);
      }
    });
  });

  const { errors } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            aria-invalid={Boolean(errors.email)}
            disabled={pendiente}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            disabled={pendiente}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>

      {errorGeneral && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errorGeneral}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pendiente} className="w-full">
        {pendiente && <Loader2Icon className="animate-spin" />}
        {pendiente ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
