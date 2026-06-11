import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getEnv, getRequiredEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripe = getStripe();
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? user.email;

      const customer = await stripe.customers.create({
        email,
        metadata: { clerkId: userId, userId: user.id },
      });
      customerId = customer.id;

      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const baseUrl = getEnv("NEXT_PUBLIC_URL") ?? "http://localhost:3000";
    const priceId = getRequiredEnv("STRIPE_PRICE_ID");
    console.log("[stripe/checkout] using price:", priceId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgraded=true`,
      cancel_url: `${baseUrl}/dashboard`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        clerkId: userId,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/checkout] error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
