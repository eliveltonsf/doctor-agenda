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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import z from "zod";
import {
  initialAvailabilityDaysOptions,
  initialAvailabilityTimesOptions,
  medicalSpecialties,
} from "../_constants";

const UpsertDoctorForm = () => {
  const formSchema = z
    .object({
      name: z.string().trim().min(2, "O nome é obrigatório"),
      email: z.string().email("Email inválido"),
      phone: z.string().trim().min(10, "O telefone é obrigatório"),
      crm: z.string().trim().min(5, "O CRM é obrigatório"),
      specialty: z.string().trim().min(2, "A especialidade é obrigatória"),
      appointmentPrice: z
        .number()
        .min(1, "O preço do atendimento é obrigatório"),
      availableFromWeekDay: z.string(),
      availableToWeekDay: z.string(),
      availableFromTime: z.string().min(1, "Hora de início é obrigatória"),
      availableToTime: z.string().min(1, "Hora de término é obrigatória"),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      crm: "",
      specialty: "",
      appointmentPrice: 0,
      availableFromWeekDay: "1",
      availableToWeekDay: "5",
      availableFromTime: "",
      availableToTime: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Médico</DialogTitle>
        <DialogDescription>
          Preencha as informações do médico novo médico.
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
          <Button type="submit">Adicionar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
