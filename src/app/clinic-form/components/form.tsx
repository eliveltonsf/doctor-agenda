"use client";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const clinicFormSchema = z.object({
  name: z.string().trim().min(2, "O nome é obrigatório"),
});

const ClinicForm = () => {
  const form = useForm<z.infer<typeof clinicFormSchema>>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clinicFormSchema>) => {
    try {
      await createClinic(data.name);
      toast.success("Clínica criada com sucesso.");
      form.reset();
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.error(error);
      toast.error("Erro ao criar clínica.");
    }
  };
  return (
    <div>
      <form
        id="clinic-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FieldGroup className="gap-3">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="clinic-form-name">Nome</FieldLabel>
                <Input
                  {...field}
                  id="clinic-form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o nome da clínica"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <DialogFooter>
          <Button
            type="submit"
            form="clinic-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Criar clínica
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default ClinicForm;
