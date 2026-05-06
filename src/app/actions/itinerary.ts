"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { StopCategory } from "@prisma/client";

const VALID_CATEGORIES = new Set<StopCategory>(["FLIGHT", "ACCOMMODATION", "FOOD", "ACTIVITY", "TRANSPORT"]);

export type AddStopResult =
  | { success: true }
  | { success: false; errors: Record<string, string> };

export async function addItineraryStop(
  tripId: string,
  _prevState: AddStopResult | null,
  formData: FormData
): Promise<AddStopResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, errors: { _form: "Non autenticato." } };
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    return { success: false, errors: { _form: "Utente non trovato nel database." } };
  }

  const participation = await prisma.tripParticipant.findUnique({
    where: { tripId_userId: { tripId, userId: dbUser.id } },
    select: { role: true, status: true },
  });

  if (!participation || participation.status !== "ACTIVE" || participation.role !== "ORGANIZER") {
    return { success: false, errors: { _form: "Solo gli organizzatori possono aggiungere tappe." } };
  }

  const name = (formData.get("name") as string | null)?.trim();
  const dateRaw = (formData.get("date") as string | null)?.trim();
  const time = (formData.get("time") as string | null)?.trim() || null;
  const categoryRaw = (formData.get("category") as string | null)?.trim() || null;
  const category: StopCategory | null =
    categoryRaw && VALID_CATEGORIES.has(categoryRaw as StopCategory)
      ? (categoryRaw as StopCategory)
      : null;
  const address = (formData.get("address") as string | null)?.trim() || null;
  const notes = (formData.get("notes") as string | null)?.trim() || null;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Il nome della tappa è obbligatorio.";
  if (!dateRaw) errors.date = "Seleziona un giorno del viaggio.";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  await prisma.itineraryStop.create({
    data: {
      tripId,
      name: name!,
      date: new Date(dateRaw!),
      time: time || null,
      category,
      address,
      notes,
    },
  });

  revalidatePath(`/trips/${tripId}/itinerary`);

  return { success: true };
}
