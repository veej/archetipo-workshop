import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;
  return prisma.user.upsert({
    where: { supabaseId: authUser.id },
    update: {
      email: authUser.email!,
      name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
      image: authUser.user_metadata?.avatar_url ?? null,
    },
    create: {
      supabaseId: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
      image: authUser.user_metadata?.avatar_url ?? null,
    },
  });
}
