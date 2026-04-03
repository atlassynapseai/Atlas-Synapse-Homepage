# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Automatic GitHub Integration (Recommended)

1. Go to https://vercel.com/new
2. Select "GitHub" and connect your GitHub account
3. Search for and import `atlassynapseai/Atlas-Synapse-Homepage`
4. Click "Import"
5. Under "Environment Variables", add all required values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `GMAIL_USER` (optional - for email notifications)
   - `GMAIL_APP_PASSWORD` (optional - for email notifications)
6. Click "Deploy"

### Option 2: Manual Vercel CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Environment Variables to Configure in Vercel

Copy these from `.env.local` and add to Vercel project settings:

### Supabase (Required)
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase key (safe in frontend)

### Stripe (Required)
- `STRIPE_SECRET_KEY` - Secret key (backend only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Publishable key (safe in frontend)
- `STRIPE_WEBHOOK_SECRET` - For webhook verification

### Email (Optional - for notifications)
- `GMAIL_USER` - Gmail address
- `GMAIL_APP_PASSWORD` - Google app-specific password

---

## Post-Deployment Checklist

After deployment, verify:

1. **Homepage loads** - Visit the production URL
2. **Signup/Signin works** - Test `/auth` page
3. **OAuth works** - Try Google/GitHub login
4. **Audit flow works** - Go through claim-scan → auth → dashboard flow
5. **Contact form works** - Test form submission at `/?scroll=contact`
6. **Stripe checkout works** - Test pricing at `/?scroll=pricing`

---

## Domain Configuration

Once deployed, update DNS:

1. In Vercel project settings → Domains
2. Add your domain: `www.atlassynapseai.com`
3. Follow Vercel's DNS instructions
4. Update DNS records at your domain registrar

---

## Troubleshooting

**Deployments failing?**
- Check logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `next build` passes locally: `npm run build`

**Pages showing 404?**
- Clear Vercel cache: Settings → Storage & Functions → Clear Cache
- Redeploy from Vercel dashboard

**Environment variables not loading?**
- Save changes and redeploy
- Use `NEXT_PUBLIC_` prefix for client-side variables

---

## Auto-Deployment

Once GitHub integration is enabled:
- Every push to `main` → automatic preview deployment
- Manual promotion to production when ready
- View deployments in Vercel dashboard

---
