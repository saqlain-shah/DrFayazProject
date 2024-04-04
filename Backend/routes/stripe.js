import express from 'express';
import stripePackage from 'stripe';
import dotenv from 'dotenv';
const router = express.Router();
const stripe = stripePackage(process.env.STRIPE_SECRET);
dotenv.config();
router.post("/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
      console.log(req.body)

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"$",
            product_data:{
                name:product.selectedService,
            },
            unit_amount:product.selectedService * 100,
        },
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["products"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:5173/sucess",
        cancel_url:"http://localhost:5173/cancel",
    });

    res.json({id:session.id})
 
})
export default router;