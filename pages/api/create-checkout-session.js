import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { courseId } = req.body;
  // In real app, verify logged-in user with session/cookie (Supabase/JWT)
  // For demo, we accept a test user ID passed via header (NOT for production)
  const userId = req.headers['x-test-user-id'] || null;
  const userEmail = req.headers['x-test-user-email'] || null;

  if (!userId || !userEmail) {
    return res.status(401).json({ error: 'Missing test user headers. In production, use real auth.' });
  }

  // Fetch course data (mock or real DB query)
  // Here we assume product info is known
  const course = { id: courseId, title: 'HPLC Fundamentals & Operation', price_cents: 19900, currency: 'usd' };

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: course.currency,
          product_data: { name: course.title },
          unit_amount: course.price_cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.slug || 'hplc-basics'}`,
      customer_email: userEmail,
      metadata: { user_id: userId, course_id: courseId }
    });

    // Optionally store session in Supabase (pending payment)
    await supabase.from('purchases').insert([{
      user_id: userId,
      course_id: courseId,
      stripe_checkout_session: session.id,
      metadata: { status: 'pending' }
    }]).throwOnError();

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
}