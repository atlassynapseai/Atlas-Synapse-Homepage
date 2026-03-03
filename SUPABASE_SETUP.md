# Atlas Synapse Homepage with Supabase Authentication

Production-ready authentication system for Atlas Synapse with Supabase (PostgreSQL + Auth) and Vercel hosting.

**Launch Date**: March 23, 2026
**Built for**: Startup with 4 products (Homepage + Aegis Prime + 2 more)
**Ready for**: Future skool.com integration

## Features

✅ Email/password signup and login
✅ Google OAuth authentication
✅ GitHub OAuth authentication
✅ Microsoft OAuth authentication
✅ Protected dashboard/profile pages
✅ User profile management in PostgreSQL
✅ Session persistence with JWT tokens
✅ Responsive dark theme design
✅ Ready for multi-product auth switching

---

## Why Supabase (Not Firebase)

For a startup with multiple products:
- **PostgreSQL**: Flexible for tracking user access across 4 products
- **No Vendor Lock-in**: Can self-host later if needed
- **Webhooks**: Easy integration with skool.com when ready
- **Cost Predictable**: $25/month covers unlimited users (vs Firebase $50-300+/month)
- **Team Friendly**: SQL/PostgreSQL is industry standard

---

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "Sign up" with GitHub
3. Click "New project"
4. Fill in:
   - Project name: `atlas-synapse`
   - Database password: (generate secure password)
   - Region: (choose closest to you)
5. Wait 2-3 minutes for database to initialize

### 2. Configure Authentication

#### Enable Email/Password
1. In Supabase Dashboard, click **Authentication** in left sidebar
2. Click **Providers**
3. Click **Email** and toggle to ON
4. Confirm checkbox for "Confirm email" and "Double-confirm changes"

#### Enable OAuth Providers
1. Still in **Providers**, enable:
   - **Google** - Takes email, requires OAuth app setup
   - **GitHub** - Takes email, requires OAuth app setup
   - **Microsoft** - Takes email, requires OAuth app setup

### Setup Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "Atlas Synapse"
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized URIs:
   ```
   http://localhost:3000
   http://localhost:3000/__/auth/callback
   https://yourdomain.com
   https://yourdomain.com/__/auth/callback
   ```
7. Copy Client ID and Client Secret
8. Paste into Supabase Google provider settings

### Setup GitHub OAuth:
1. Go to GitHub Settings → **Developer settings** → **OAuth Apps**
2. New OAuth App with:
   - Application name: `Atlas Synapse`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback: `http://localhost:3000/__/auth/callback`
3. Copy **Client ID** and **Client Secret**
4. Paste into Supabase GitHub provider settings

### Setup Microsoft OAuth:
1. Go to [Azure Portal](https://portal.azure.com)
2. Search "App registrations" → **New registration**
3. Fill in:
   - Name: `Atlas Synapse`
   - Account type: "Accounts in any organizational directory"
4. Go to **Certificates & secrets** → **New client secret**
5. Go to **Authentication** → **Platform configurations** → **Add a platform** → **Web**
6. Add redirect URI: `http://localhost:3000/__/auth/callback`
7. Copy **Application ID** and **Client Secret**
8. Paste into Supabase Microsoft provider settings

### 3. Create Database Tables

In Supabase, go to **SQL Editor** and run this:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  skool_id VARCHAR,
  skool_enrollment_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_products table (track access to each product)
CREATE TABLE user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR NOT NULL, -- 'homepage', 'aegis-prime', 'product-3', 'product-4'
  access_level VARCHAR DEFAULT 'standard', -- 'beta', 'premium', 'standard'
  enrolled_date TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(user_id, product_name)
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own products"
  ON user_products FOR SELECT
  USING (auth.uid() = user_id);
```

### 4. Setup Environment Variables

1. In Supabase Dashboard, click **Settings** → **API**
2. Copy:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - Anon Key (public key for client-side)

3. Create `.env.local` in project root:
```bash
cp .env.local.example .env.local
```

4. Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ SECURITY**: Never commit `.env.local` to git (already in .gitignore)

### 5. Install Dependencies & Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and test:
- Sign up with email/password → should create user in `users` table
- Sign in with Google/GitHub/Microsoft
- View dashboard with user profile
- Sign out

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 7. Configure OAuth for Production

Update your OAuth provider settings with production URLs:
- Google: Add your `yourdomain.com` redirects
- GitHub: Update callback to `https://yourdomain.com/__/auth/callback`
- Microsoft: Update reply URL to `https://yourdomain.com/__/auth/callback`

---

## Future: skool.com Integration

When you're ready to integrate skool.com:

1. **Get skool.com API docs** - Check if they support webhooks for enrollment events
2. **Create webhook endpoint** - Next.js API route to receive enrollment updates
3. **Update database** - When user enrolls in skool.com:
   ```sql
   UPDATE users
   SET skool_id = 'skool_user_id',
       skool_enrollment_active = true
   WHERE email = 'user@example.com'
   ```
4. **Add product access** - Track which products user can access
5. **Check on login** - Verify enrollment status before granting access

### Placeholder for Future Webhook

```typescript
// app/api/webhooks/skool/route.ts
export async function POST(request: Request) {
  const data = await request.json()
  // TODO: Verify webhook signature from skool.com
  // TODO: Update user enrollment status
  // TODO: Grant/revoke product access
  return Response.json({ success: true })
}
```

---

## Project Structure

```
.
├── app/
│   ├── page.tsx                # Homepage
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── globals.css             # Tailwind CSS
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Sign up page
│   ├── dashboard/page.tsx      # Protected user dashboard
│   └── api/
│       └── webhooks/
│           └── skool/route.ts  # (Future) skool.com webhooks
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── auth-context.tsx        # Auth provider
├── components/
│   └── navbar.tsx              # Navbar component
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local.example
```

---

## Database Schema

### users table
```sql
id          UUID        (user ID from auth)
email       VARCHAR     (unique email)
name        VARCHAR     (display name)
skool_id    VARCHAR     (future: skool.com ID)
skool_enrollment_active BOOLEAN (future)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### user_products table
```sql
id              UUID      (primary key)
user_id         UUID      (links to users.id)
product_name    VARCHAR   ('homepage', 'aegis-prime', 'product-3', 'product-4')
access_level    VARCHAR   ('beta', 'premium', 'standard')
enrolled_date   TIMESTAMP
expires_at      TIMESTAMP (optional: when access expires)
```

---

## Troubleshooting

### OAuth not working
- Check redirect URIs match exactly in both Supabase and OAuth provider
- For local dev: use `http://localhost:3000/__/auth/callback`
- For production: use `https://yourdomain.com/__/auth/callback`

### "users table missing"
- Make sure you ran the SQL setup script in Supabase SQL Editor
- Check that RLS policies are enabled

### .env.local not loaded
- File must be named exactly `.env.local` (not `.env`)
- Make sure variables start with `NEXT_PUBLIC_`
- Restart dev server after creating file

### User not created in database
- Check that users table exists
- Make sure signup form saves user to `users` table after auth signup
- Check Supabase logs for errors

---

## Cost Estimate

**Supabase Pricing** (as of 2026):
- **Free tier**: Up to 500MB database, includes auth
- **Pro tier**: $25/month + usage
  - 500 million auth requests
  - 50GB database
  - Good for 1000s of users

**Comparison to Firebase**:
- 100 users: Firebase $20/month vs Supabase $0 (free tier)
- 500 users: Firebase $100/month vs Supabase $25/month
- 5000 users: Firebase $500+/month vs Supabase $100-200/month

---

## Support & Docs

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/ai/nextjs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## Next Steps (Before March 23 Launch)

- [ ] Create Supabase project
- [ ] Setup OAuth providers (Google, GitHub, Microsoft)
- [ ] Create database tables
- [ ] Test signup/login locally
- [ ] Deploy to Vercel
- [ ] Setup custom domain (optional)
- [ ] Test on production
- [ ] Prepare for skool.com integration
