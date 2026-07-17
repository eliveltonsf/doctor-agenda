"use server";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { headers } from "next/headers";
import { doctorsTable } from "./../../db/schema";
import { upsetDoctorSchema } from "./schema";

export const upsetDoctor = actionClient
  .schema(upsetDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User is not authenticated");
    }

    if (!session?.user?.clinic?.id) {
      throw new Error("User is not associated with a clinic");
    }

    await db
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        clinicId: session.user.clinic.id,
        ...parsedInput,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
        },
      });
  });
