"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type ActionResult =
  | { success: true; tripId: string }
  | { success: false; errors: Record<string, string> };

export async function createTrip(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, errors: { _form: "Non autenticato." } };
  }

  const name = formData.get("name") as string | null;
  const startDateRaw = formData.get("startDate") as string | null;
  const endDateRaw = formData.get("endDate") as string | null;
  const destination = formData.get("destination") as string | null;
  const coverKeyRaw = formData.get("coverKey") as string | null;

  const errors: Record<string, string> = {};

  if (!name?.trim()) errors.name = "Il nome del viaggio è obbligatorio.";
  if (!startDateRaw?.trim()) errors.startDate = "La data di inizio è obbligatoria.";
  if (!endDateRaw?.trim()) errors.endDate = "La data di fine è obbligatoria.";
  if (!destination?.trim()) errors.destination = "La destinazione è obbligatoria.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const startDate = new Date(startDateRaw!);
  const endDate = new Date(endDateRaw!);

  if (endDate < startDate) {
    return {
      success: false,
      errors: { endDate: "La data di fine deve essere uguale o successiva alla data di inizio." },
    };
  }

  const coverKey = coverKeyRaw?.trim() || null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    return { success: false, errors: { _form: "Utente non trovato nel database." } };
  }

  const trip = await prisma.$transaction(async (tx) => {
    const newTrip = await tx.trip.create({
      data: {
        name: name!.trim(),
        startDate,
        endDate,
        destination: destination!.trim(),
        coverKey,
      },
    });

    await tx.tripParticipant.create({
      data: {
        tripId: newTrip.id,
        userId: dbUser.id,
        role: "ORGANIZER",
        status: "ACTIVE",
      },
    });

    return newTrip;
  });

  revalidatePath("/dashboard");

  return { success: true, tripId: trip.id };
}
