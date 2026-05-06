import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { joinTripByInvite } from "@/app/actions/invites";
import InviteError from "./invite-error";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  // 1. Validate token with Prisma — before auth check so unauthenticated users
  //    with invalid tokens get a meaningful error instead of a sign-in bounce.
  const invite = await prisma.tripInvite.findUnique({ where: { token } });

  if (!invite) {
    return <InviteError reason="invalid" />;
  }

  if (invite.expiresAt <= new Date()) {
    return <InviteError reason="expired" />;
  }

  // 2. Check auth — token is valid, now ensure the user is signed in.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/signin?next=/invite/${token}`);
  }

  // 3. Join the trip — handles idempotency (already a participant returns success).
  const result = await joinTripByInvite(token);

  if (result.success) {
    redirect(`/trips/${result.tripId}`);
  }

  if (result.error === "Invito scaduto.") {
    return <InviteError reason="expired" />;
  }

  return <InviteError reason="invalid" />;
}
