# Complete Supabase Setup & Deployment Guide
## For Atlas Synapse (March 23, 2026 Launch)

This guide walks you through setting up Supabase, connecting it to your app, and deploying to production.

---

## STEP 1: Create Supabase Project (15 minutes)

### 1.1 Create Account & Project

1. Go to **https://supabase.com**
2. Click **"Sign Up"** (or use GitHub login)
3. Complete email verification
4. Click **"New Project"**
5. Fill in:
   - **Project name**: `atlas-synapse`
   - **Database password**: Generate a strong password (save this somewhere safe!)
   - **Region**: Choose closest to your users (e.g., `us-east-1` for US)
6. Click **"Create new project"**
7. Wait **2-3 minutes** for your database to initialize

### 1.2 Get Your Connection Details

Once your project is ready:

1. Click **Settings** → **Database** in the left sidebar
2. Note your **Connection String** (you'll need this later for Railway)
3. Click **API** in the left sidebar
4. Copy and save these:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Key** (public key for client-side)
   - **Service Role Key** (secret key for server-side - keep private!)

---

## STEP 2: Create Database Tables (10 minutes)

### 2.1 Run SQL Migration

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste the entire contents of `/migrations.sql` from your project
4. Click **Run** (blue triangle button)
5. You should see: `✓ Success` for both CREATE TABLE commands

**Verify it worked:**
- Click **Table Editor** in the left sidebar
- You should see two new tables:
  - `users`
  - `user_products`

---

## STEP 3: Set Up OAuth Providers (30 minutes)

OAuth allows users to sign in with Google/GitHub.

### 3.1 Enable OAuth in Supabase

1. In Supabase dashboard, click **Authentication** → **Providers**
2. Enable these toggles:
   - **Email** (already enabled)
   - **Google**
   - **GitHub**

### 3.2 Set Up Google OAuth

**On Google Cloud Console:**

1. Go to **https://console.cloud.google.com**
2. Click **Select a Project** → **NEW PROJECT**
3. Enter project name: `Atlas Synapse`
4. Click **Create**
5. Wait for creation, then click the project
6. Go to **APIs & Services** → **Credentials** (left sidebar)
7. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
8. Choose **Web application**
9. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```
10. Under **Authorized redirect URIs**, add:
    ```
    http://localhost:3000/__/auth/callback
    https://yourdomain.com/__/auth/callback
    ```
11. Click **Create**
12. Copy your **Client ID** and **Client Secret**

**Back in Supabase:**

1. Go to **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

### 3.3 Set Up GitHub OAuth

**On GitHub:**

1. Go to **https://github.com/settings/apps** (Developer settings → OAuth Apps)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `Atlas Synapse`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/__/auth/callback`
4. Click **Register application**
5. Copy your **Client ID** and **Client Secret**

**Back in Supabase:**

1. Go to **Authentication** → **Providers** → **GitHub**
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

---

## STEP 4: Update Your App Environment Variables (5 minutes)

### 4.1 Create `.env.local`

1. In your project root, create a new file: `.env.local`
2. Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. **Never commit this file** (already in `.gitignore`)

### 4.2 Verify Environment Setup

```bash
npm run dev
```

Visit `http://localhost:3000/Atlas-Synapse-Homepage/signup` and you should see:
- ✅ Form fields with animations
- ✅ Google and GitHub OAuth buttons
- ✅ No console errors

---

## STEP 5: Test Locally (15 minutes)

### 5.1 Test Email/Password Signup

1. Go to `http://localhost:3000/Atlas-Synapse-Homepage/signup`
2. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `TempPassword123!`
3. Click **Sign Up**
4. Expected result: Redirects to dashboard showing your profile

**Verify in Supabase:**
- Go to Supabase dashboard → **Table Editor** → **users** table
- You should see a new row with your test user

### 5.2 Test Login

1. Go to `http://localhost:3000/Atlas-Synapse-Homepage/login`
2. Enter: `test@example.com` / `TempPassword123!`
3. Click **Sign In**
4. Expected result: Redirects to dashboard

### 5.3 Test Google OAuth

1. Go to `http://localhost:3000/Atlas-Synapse-Homepage/signup`
2. Click **Sign Up with Google**
3. Login with your Google account
4. Expected result: Creates user and redirects to dashboard

### 5.4 Test Logout

1. On dashboard, click **Sign Out**
2. You should be redirected to homepage

---

## STEP 6: Deploy to Vercel (10 minutes)

### 6.1 Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment with Supabase"
git push origin main
```

### 6.2 Deploy to Vercel

1. Go to **https://vercel.com**
2. Click **Add New** → **Project**
3. Select your GitHub repository:
   - Search: `Atlas-Synapse-Homepage`
   - Click **Import**
4. Click **Deploy**
5. Wait for deployment to complete (~2-3 minutes)
6. Copy your Vercel URL (e.g., `https://atlas-synapse-homepage.vercel.app`)

### 6.3 Add Environment Variables to Vercel

1. In Vercel dashboard, click your project
2. Go to **Settings** → **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
   ```
4. Click **Save** → **Redeploy**

### 6.4 Update OAuth Redirect URIs

Add your production Vercel URL to:

**Google OAuth:**
- Go to Google Cloud Console → Your project → **APIs & Services** → **Credentials**
- Click your OAuth app
- Add redirect URI: `https://your-vercel-url/__/auth/callback`
- Click **Save**

**GitHub OAuth:**
- Go to GitHub → Settings → **Developer settings** → **OAuth Apps** → Your app
- Update **Authorization callback URL** to: `https://your-vercel-url/__/auth/callback`
- Click **Update application**

### 6.5 Update Supabase Redirect URIs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   https://your-vercel-url/__/auth/callback
   ```
3. Click **Save**

---

## STEP 7: Test Production (10 minutes)

### 7.1 Test Signup in Production

1. Visit your Vercel URL: `https://your-vercel-url/Atlas-Synapse-Homepage/signup`
2. Create a new account with email/password
3. Verify redirect to dashboard

### 7.2 Test OAuth in Production

1. Click **Sign Up with Google** or **GitHub**
2. Complete OAuth flow
3. Verify user is created in Supabase

---

## STEP 8: Connect Railway to Shared Supabase (15 minutes)

This allows your Auditor backend on Railway to query user data.

### 8.1 Get Supabase Connection String

1. In Supabase, go to **Settings** → **Database**
2. Find section: **Connection string**
3. Select **URI** format
4. Copy the connection string (replace `[YOUR-PASSWORD]` with your database password)

Example:
```
postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
```

### 8.2 Update Railway Environment

1. Go to your **Railway project dashboard**
2. Click your **Auditor service**
3. Go to **Variables**
4. Add/Update:
   ```
   DATABASE_URL = postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres
   SUPABASE_URL = https://xxxxx.supabase.co
   SUPABASE_ANON_KEY = your_anon_key_here
   ```
5. Click **Deploy**

### 8.3 Test Railway Connection

In your Auditor API, you can now query:

```typescript
// Example: Get user by email
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'user@example.com')
  .single()
```

---

## STEP 9: Ready for skool.com Integration (Future)

Your database is ready for skool.com webhooks:

```sql
-- When user enrolls in skool.com, webhook updates:
UPDATE users
SET skool_id = 'skool_user_123',
    skool_enrollment_active = true
WHERE email = 'user@example.com'
```

Then check access on login:
```typescript
if (user.skool_enrollment_active) {
  // Show premium features
}
```

---

## Troubleshooting

### "supabaseUrl is required" error
- Make sure `.env.local` exists in project root
- Restart dev server: `npm run dev`

### OAuth redirect loop
- Check that redirect URIs match exactly in Supabase + OAuth provider + Vercel
- No trailing slashes!

### Can't create new users
- Check `users` table exists in Supabase
- Verify RLS policies are enabled (should be automatic)
- Check browser console for specific errors

### Railway can't connect to Supabase
- Verify Supabase connection string is correct
- Make sure password is properly URL-encoded if it has special characters
- Add Supabase IP to Railway firewall (if needed)

---

## Quick Reference

| Service | What It Does | Free Tier |
|---------|-------------|-----------|
| **Supabase** | Database + Auth | 500MB database, unlimited users |
| **Vercel** | Hosting | 100GB bandwidth/month |
| **Railway** | Auditor backend | $5/month free tier |

---

## ✅ Done! Your architecture is:

```
Users signup at: https://yourdomain.com/signup
     ↓
Saved to Supabase PostgreSQL
     ↓
Can login at: https://yourdomain.com/login
     ↓
Dashboard shows profile
     ↓
Auditor API (Railway) can query users
     ↓
Future: skool.com webhooks sync enrollments
```

**Total setup time: ~2 hours**
**Next milestone: March 23, 2026 Launch** 🚀
