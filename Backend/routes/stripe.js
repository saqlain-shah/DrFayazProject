import express from 'express';
import stripePackage from 'stripe';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

router.post("/checkout", async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.serviceName,
                },
                unit_amount: item.price * 100,
            },
            quantity: 1, // Assuming each product has a quantity of 1
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://www.avicenahealthcare.com/success",
            cancel_url: "http://www.avicenahealthcare.com/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

export default router;
