import { upsetDoctor } from "@/actions/upset-doctor";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";
import {
  crmStateOptions,
  initialAvailabilityDaysOptions,
  initialAvailabilityTimesOptions,
  medicalSpecialties,
} from "../_constants";

const formSchema = z
  .object({
    name: z.string().trim().min(2, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().trim().min(10, "O telefone é obrigatório"),
    crm: z.string().trim().min(5, "O CRM é obrigatório"),
    specialty: z.string().trim().min(2, "A especialidade é obrigatória"),
    appointmentPrice: z.number().min(1, "O preço do atendimento é obrigatório"),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z.string().min(1, "Hora de início é obrigatória"),
    availableToTime: z.string().min(1, "Hora de término é obrigatória"),
    stateCRM: z.string().trim().min(2, "O estado do CRM é obrigatório"),
  })
  .refine(
    (data) => {
      const fromTime = data.availableFromTime;
      const toTime = data.availableToTime;
      return fromTime < toTime;
    },
    {
      message: "O horário final deve ser maior que o horário inicial",
      path: ["availableToTime"],
    },
  );

interface upsetDoctorActionProps {
  doctor?: typeof doctorsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertDoctorForm = ({ doctor, onSuccess }: upsetDoctorActionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name || "",
      email: doctor?.email || "",
      phone: doctor?.phone || "",
      crm: doctor?.crm.split("/")[0] || "",
      stateCRM: doctor?.crm.split("/")[1] || "",
      specialty: doctor?.specialty || "",
      appointmentPrice: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      availableFromWeekDay: doctor?.availableFromWeekDay
        ? doctor.availableFromWeekDay.toString()
        : "1",
      availableToWeekDay: doctor?.availableToWeekDay
        ? doctor.availableToWeekDay.toString()
        : "5",
      availableFromTime: doctor?.availableFromTime || "",
      availableToTime: doctor?.availableToTime || "",
    },
  });

  const upsetDoctorAction = useAction(upsetDoctor, {
    onSuccess: () => {
      toast.success(
        `Médico ${doctor ? "atualizado" : "adicionado"} com sucesso!`,
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error("Ocorreu um erro ao adicionar o médico.");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsetDoctorAction.execute({
      ...values,
      id: doctor?.id,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      appointmentPriceInCents: values.appointmentPrice * 100,
      crm: `${values.crm}/${values.stateCRM}`,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{doctor ? doctor.name : "Adicionar Médico"}</DialogTitle>
        <DialogDescription>
          {doctor
            ? "Edite as informações desse médico."
            : "Preencha as informações do médico novo médico."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-6 h-100 space-y-4 overflow-auto rounded-md p-4"
      >
        <FieldGroup className="gap-3">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-register-name">Nome</FieldLabel>
                <Input
                  {...field}
                  id="form-register-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite seu nome"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-register-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="form-register-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite seu email"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-register-phone">Telefone</FieldLabel>
                <PhoneInput placeholder="Digite seu telefone" {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="crm"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-register-crm">CRM</FieldLabel>
                  <Input
                    {...field}
                    id="form-register-crm"
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu CRM"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="stateCRM"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet
                  className="w-full gap-3"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLegend
                    variant="label"
                    className={fieldState.invalid ? "text-red-500" : ""}
                  >
                    Estado do CRM
                  </FieldLegend>
                  <Field>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="form-register-state-crm"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {crmStateOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />
          </div>

          <Controller
            name="specialty"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet
                className="w-full gap-3"
                data-invalid={fieldState.invalid}
              >
                <FieldLegend
                  variant="label"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Especialidade
                </FieldLegend>
                <Field>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="pg-form-specialty"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {medicalSpecialties.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          <Controller
            name="appointmentPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-register-appointmentPrice">
                  Preço da Consulta
                </FieldLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  id="form-register-appointmentPrice"
                  aria-invalid={fieldState.invalid}
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  customInput={Input}
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="availableFromWeekDay"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet
                className="w-full gap-3"
                data-invalid={fieldState.invalid}
              >
                <FieldLegend
                  variant="label"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Dia inicial de disponibilidade
                </FieldLegend>
                <Field>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger
                      id="pg-form-availableFromWeekDay"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {initialAvailabilityDaysOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          <Controller
            name="availableToWeekDay"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet
                className="w-full gap-3"
                data-invalid={fieldState.invalid}
              >
                <FieldLegend
                  variant="label"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Dia final de disponibilidade
                </FieldLegend>
                <Field>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="pg-form-availableToWeekDay"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {initialAvailabilityDaysOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          <Controller
            name="availableFromTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet
                className="w-full gap-3"
                data-invalid={fieldState.invalid}
              >
                <FieldLegend
                  variant="label"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Horario inicial de disponibilidade
                </FieldLegend>
                <Field>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger
                      id="pg-form-availableFromTime"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {initialAvailabilityTimesOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          <Controller
            name="availableToTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet
                className="w-full gap-3"
                data-invalid={fieldState.invalid}
              >
                <FieldLegend
                  variant="label"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Horario final de disponibilidade
                </FieldLegend>
                <Field>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger
                      id="pg-form-availableToTime"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {initialAvailabilityTimesOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </FieldGroup>
        <DialogFooter className="mt-4">
          <Button type="submit" disabled={upsetDoctorAction.isPending}>
            {upsetDoctorAction.isPending
              ? "Adicionando..."
              : doctor
                ? "Salvar"
                : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
