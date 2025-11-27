# LabTrain Starter (Next.js + Supabase + Stripe + S3 signed URL)

This starter contains example code to:
- Serve public course pages (Next.js)
- Create Stripe Checkout sessions (server-side)
- Verify Stripe webhooks and record purchases (example DB calls)
- Issue signed S3 URLs after entitlement check (example)

## What I included
- `pages/` - Next.js pages (index, course page)
- `pages/api/create-checkout-session.js` - Create Stripe Checkout session
- `pages/api/webhooks/stripe.js` - Stripe webhook handler (raw body parsing)
- `pages/api/signed-url.js` - Example endpoint to return a signed S3 URL (requires AWS creds)
- `lib/supabase.js` - Supabase client helper
- `lib/db.sql` - SQL for `courses` and `purchases` tables
- `.env.example` - environment variables required for local testing
- Deployment instructions for Vercel (see below)

## Quick setup (local dev)
1. Copy `.env.example` to `.env.local` and fill values (use Stripe test keys and Supabase test project).
2. `npm install`
3. `npm run dev`
4. Use Stripe CLI to forward webhooks in dev or set webhook in Stripe dashboard to your deployed URL.

## Deployment (Vercel)
- Push this repo to GitHub.
- Create a Vercel project from the repo.
- Add environment variables in Vercel (see .env.example keys).
- Set Stripe webhook endpoint to `https://<your-vercel-domain>/api/webhooks/stripe` and add the webhook secret to Vercel env `STRIPE_WEBHOOK_SECRET`.

## Notes
- This starter is a template and uses simple placeholder DB calls. Replace `db` helpers with real SQL or Supabase client queries.
- For production, ensure HTTPS, proper CORS, and secure handling of secrets.