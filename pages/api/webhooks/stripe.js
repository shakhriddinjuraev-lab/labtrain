import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../../../lib/supabase';

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const userId = metadata.user_id;
    const courseId = metadata.course_id;

    // Record the successful purchase in Supabase
    try {
      await supabase.from('purchases').insert([{
        user_id: userId,
        course_id: courseId,
        stripe_checkout_session: session.id,
        stripe_payment_intent: session.payment_intent,
        purchased_at: new Date(session.created * 1000),
        metadata: { session }
      }]).throwOnError();
      console.log('Purchase recorded for user', userId);
    } catch (err) {
      console.error('Failed to record purchase in Supabase', err);
    }
  }

  res.json({ received: true });
}