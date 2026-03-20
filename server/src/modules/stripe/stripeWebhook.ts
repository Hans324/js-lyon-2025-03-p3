import type { Request, Response } from "express";
import Stripe from "stripe";
import rentRepository from "../rent/rentRepository";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    console.error("Missing stripe-signature header");
    res.status(400).send("Missing Stripe signature");
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);

    console.info(`Stripe webhook received: ${event.type}`);
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  // --------------------
  // Payment completed
  // --------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const shipId = session.metadata?.shipId;
    const userId = session.metadata?.userId;

    if (!shipId || !userId) {
      console.warn("Missing shipId or userId in Stripe metadata");
      res.status(400).send("Missing metadata");
      return;
    }

    try {
      await rentRepository.create(userId, shipId);

      console.info(
        `Payment validated -> rent created: user ${userId} ship ${shipId}`,
      );
    } catch (err) {
      console.error("Database update after payment failed:", err);
      res.status(500).send("Database error");
      return;
    }
  } else {
    console.info(`Unhandled Stripe event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

export default stripeWebhook;
