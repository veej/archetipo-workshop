import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  // Handle email confirmation (sign up verify)
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email" | "signup" | "recovery",
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await prisma.user.upsert({
          where: { supabaseId: user.id },
          update: {
            email: user.email!,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            image: user.user_metadata?.avatar_url ?? null,
          },
          create: {
            supabaseId: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            image: user.user_metadata?.avatar_url ?? null,
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(`${origin}/auth/signin`);
  }

  // Handle OAuth callback (code exchange)
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await prisma.user.upsert({
          where: { supabaseId: user.id },
          update: {
            email: user.email!,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            image: user.user_metadata?.avatar_url ?? null,
          },
          create: {
            supabaseId: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            image: user.user_metadata?.avatar_url ?? null,
          },
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/signin`);
}
