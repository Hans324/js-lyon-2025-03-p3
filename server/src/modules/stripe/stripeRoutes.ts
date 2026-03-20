import express from "express";
import Stripe from "stripe";
import verifyToken from "../../middlewares/verifiyToken";
import shipRepository from "../ship/shipRepository";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --------------------
// Create checkout session
// --------------------
router.post("/api/create-checkout-session", verifyToken, async (req, res) => {
  try {
    // Vérification utilisateur
    if (!req.user || !req.user.sub) {
      console.error("Missing user in JWT");
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const shipId = Number(req.body.shipId);

    if (Number.isNaN(shipId)) {
      return res.status(400).json({ message: "Ship ID invalide" });
    }
    // Vérifier que le vaisseau existe
    const ship = await shipRepository.read(shipId);

    if (!ship) {
      return res.status(404).json({ message: "Vaisseau introuvable" });
    }

    console.info(
      `Stripe checkout requested: user ${req.user.sub} -> ship ${shipId}`,
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Location de vaisseau",
            },
            unit_amount: 50000000,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,

      metadata: {
        userId: String(req.user.sub),
        shipId: String(shipId),
      },
    });

    console.info(`Stripe session created: ${session.id}`);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    res.status(500).json({ message: "Impossible de créer la session Stripe" });
  }
});

export default router;
