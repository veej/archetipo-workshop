"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type InviteResult =
  | { success: true; token: string; expiresAt: Date }
  | { success: false; error: string };

export async function generateInviteLink(tripId: string): Promise<InviteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Non autenticato." };
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { id: true },
  });

  if (!dbUser) {
    return { success: false, error: "Utente non trovato nel database." };
  }

  const participant = await prisma.tripParticipant.findFirst({
    where: {
      tripId,
      userId: dbUser.id,
      role: "ORGANIZER",
      status: "ACTIVE",
    },
  });

  if (!participant) {
    return { success: false, error: "Non autorizzato." };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 86_400_000);

  await prisma.tripInvite.create({
    data: {
      tripId,
      token,
      expiresAt,
    },
  });

  return { success: true, token, expiresAt };
}
