import { z } from "zod";

export const upsetDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(2, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().trim().min(10, "O telefone é obrigatório"),
    crm: z.string().trim().min(5, "O CRM é obrigatório"),
    specialty: z.string().trim().min(2, "A especialidade é obrigatória"),
    appointmentPriceInCents: z
      .number()
      .min(1, "O preço do atendimento é obrigatório"),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
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

export type UpsetDoctorSchema = z.infer<typeof upsetDoctorSchema>;
