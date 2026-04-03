# 🚀 DEPLOY TO VERCEL - STEP BY STEP GUIDE

**Status:** Ready to deploy immediately ✅

---

## ⏱️ Time Required
- Vercel Setup & Deploy: **5-10 minutes**
- Domain Configuration: **10 minutes** (optional, can do later)
- Total to go live: **15-20 minutes**

---

## STEP 1: Deploy to Vercel (5 minutes)

### 1a. Open Vercel
Visit: **https://vercel.com/new**

### 1b. Select GitHub
Click the "GitHub" button to connect your GitHub account.

### 1c. Authorize Vercel
- Click "Authorize Vercel"
- Sign in to GitHub if prompted
- Grant Vercel access to your repositories

### 1d. Import the Project
Search for: **Atlas-Synapse-Homepage**

Look for: `atlassynapseai/Atlas-Synapse-Homepage`

Click **"Import"**

### 1e. Project Settings (Keep Defaults)
- Project Name: `atlas-synapse-homepage` (or your choice)
- Framework: Should auto-detect `Next.js` ✓
- Root Directory: `.` (default) ✓
- Build Command: `npm run build` (auto-detected) ✓
- Output Directory: `.next` (auto-detected) ✓

Click **"Continue"**

### 1f. Add Environment Variables
Under "Environment Variables", add these **5 variables**:

Copy each value from your `.env.local` file:

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `[Copy from .env.local - line 2]`
- Click "Add"

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `[Copy from .env.local - line 3]`
- Click "Add"

**Variable 3:**
- Name: `STRIPE_SECRET_KEY`
- Value: `[Copy from .env.local - line 6]`
- Click "Add"

**Variable 4:**
- Name: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Value: `[Copy from .env.local - line 7]`
- Click "Add"

**Variable 5:**
- Name: `STRIPE_WEBHOOK_SECRET`
- Value: `[Copy from .env.local - line 8]`
- Click "Add"

### 1g. Deploy
Click the big **"Deploy"** button

**Wait 3-5 minutes** for deployment to complete...

You'll see:
```
✓ Building...
✓ Uploaded successfully
✓ Deployment complete!
```

You'll get a URL like:
```
https://atlas-synapse-homepage.vercel.app
```

---

## STEP 2: Verify Deployment Works (5 minutes)

Visit your Vercel URL and test these flows:

**Test 1: Homepage loads**
- [ ] Homepage displays correctly
- [ ] All sections scroll smoothly
- [ ] Portal section visible (if logged in)

**Test 2: Signup works**
- [ ] Click "Get Started" → goes to /auth
- [ ] Fill signup form with email
- [ ] Submit → account created
- [ ] Check inbox for welcome email

**Test 3: Google OAuth works**
- [ ] Click "Continue with Google"
- [ ] Redirect to Google login
- [ ] Login → redirected back to complete-profile
- [ ] Complete profile → redirect to /dashboard

**Test 4: Dashboard works**
- [ ] Click dashboard link in navbar
- [ ] Shows account info
- [ ] Shows subscription section
- [ ] Shows products section

**Test 5: Contact form works**
- [ ] Scroll to contact section with `/?scroll=contact`
- [ ] Fill contact form
- [ ] Submit → "Message sent" confirmation

**If all tests pass:** ✅ Deployment successful!

---

## STEP 3: Configure Custom Domain (10 minutes - Optional)

To use **www.atlassynapseai.com** instead of the Vercel URL:

### 3a. In Vercel Dashboard
1. Go to your project
2. Click **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter: `www.atlassynapseai.com`
5. Click **"Add"**

Vercel shows: "Invalid DNS configuration"

### 3b. Copy DNS Records
Vercel shows 2 DNS records to add. Copy them.

### 3c. Update Domain Registrar
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Settings** → **DNS Records**
3. Add the records Vercel gave you
4. Save

### 3d. Verify DNS
- Back in Vercel, click "Verify"
- Wait 15-30 minutes for DNS to propagate
- Refresh the page
- When verified, you're done!

Now your site works at: **https://www.atlassynapseai.com** ✅

---

## STEP 4: Update Stripe Webhook (5 minutes)

To receive payment notifications:

### 4a. In Stripe Dashboard
1. Go to: https://dashboard.stripe.com/
2. Click **Developers** (bottom left)
3. Click **Webhooks**
4. Find your existing webhook
5. Click **"Edit"**

### 4b. Update Endpoint URL
Change the URL to your Vercel URL:

**If using custom domain:**
```
https://www.atlassynapseai.com/api/stripe/webhooks
```

**If using Vercel URL:**
```
https://atlas-synapse-homepage.vercel.app/api/stripe/webhooks
```

### 4c. Save Events
Keep these events enabled:
- `payment_intent.succeeded`
- `charge.refunded`
- `customer.subscription.updated`

Click **"Save"** ✅

---

## STEP 5: Test Production Payments (5 minutes)

Test the complete payment flow:

### 5a. Signup/Login
- Create new test account on your Vercel URL
- Go to dashboard

### 5b. Go to Pricing
- Click "Pricing" in navbar OR
- Visit: `/?scroll=pricing`

### 5c. Subscribe to Plan
- Click "Subscribe" on Premium tier
- You'll be redirected to Stripe Checkout

### 5d. Use Test Card
Enter test payment card:
```
Card Number: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

Click **"Pay"** → you should see success confirmation

Check your Stripe Dashboard → you'll see the test charge ✅

---

## FINAL CHECKLIST

After deployment, verify:

- [ ] Homepage loads at Vercel URL
- [ ] All sections display correctly
- [ ] Signup/signin works
- [ ] Google OAuth works
- [ ] Email notifications work
- [ ] Dashboard shows user info
- [ ] Contact form submits
- [ ] Stripe checkout works
- [ ] Dashboard shows pricing
- [ ] Navigation works
- [ ] Mobile responsive

---

## 📊 Status After Deployment

Once you complete above, you'll have:

✅ **Live Production Site**
- URL: `https://atlas-synapse-homepage.vercel.app`
- Or: `https://www.atlassynapseai.com` (after DNS setup)

✅ **Auto-Deployment**
- Every push to GitHub main → auto-deploys

✅ **Production Features**
- User authentication (email + OAuth)
- Stripe payments
- Email notifications
- Contact form
- Audit results dashboard

✅ **Monitoring**
- Vercel analytics
- Error tracking
- Performance monitoring

---

## 🆘 If Something Goes Wrong

**Deployment failed in Vercel?**
1. Check "Deployment logs" in Vercel dashboard
2. Look for error messages
3. Most common: missing environment variable
4. Redeploy after fixing

**Pages show 404?**
1. In Vercel: Settings → Storage → "Clear all"
2. Redeploy

**OAuth not working?**
1. Verify Supabase credentials are correct
2. Check GitHub/Google OAuth apps are configured in Supabase

**Stripe not working?**
1. Verify webhook URL is updated
2. Check Stripe keys in Vercel environment variables
3. Make sure using TEST keys (sk_test_, pk_test_)

---

## 🎉 YOU'RE DONE!

After completing these steps, your application is **fully live in production** with:
- User authentication
- OAuth integration
- Stripe payments
- Email notifications
- Audit results dashboard

**Estimated time: 15-20 minutes total**

---

## Next Steps (After Going Live)

1. Monitor error reports in Vercel
2. Check user signups in Supabase
3. Monitor payments in Stripe
4. Gather user feedback
5. Plan next features

---
