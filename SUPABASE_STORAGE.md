# Supabase Data Storage Verification

## Profile Completion Form → `users` table

**Stored on form submission** from `/app/complete-profile/page.tsx`:

```sql
-- User profile data stored here
SELECT id, email, name, company, job_title, phone, created_at FROM users;

-- Expected columns:
-- id (UUID) — user ID from auth
-- email (VARCHAR) — user email
-- name (VARCHAR) — full name
-- company (VARCHAR) — company name ✅ NEWLY ADDED
-- job_title (VARCHAR) — job title ✅ NEWLY ADDED
-- phone (VARCHAR) — formatted as "+1 555 000 0000" ✅ NEWLY ADDED
-- created_at (TIMESTAMP)
-- updated_at (TIMESTAMP)
```

**Verification query** (run in Supabase SQL Editor):
```sql
-- Check if new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Should include: phone, company, job_title columns
```

---

## Contact Submissions → `contact_submissions` table

**Stored on form submission** from `/app/api/contact/route.ts`:

```sql
-- Contact form submissions stored here
SELECT id, name, email, phone, company, subject, message, how_heard, created_at FROM contact_submissions;

-- Expected columns:
-- id (UUID) — unique submission ID
-- name (text) — sender name
-- email (text) — sender email
-- dial_code (text) — country code (+1, +44, etc.)
-- phone (text) — phone number
-- company (text) — company name
-- subject (text) — inquiry subject
-- message (text) — message body
-- how_heard (text) — source of discovery
-- attachment_names (text[]) — array of uploaded filenames
-- status (text) — submission status (default: 'new')
-- created_at (timestamptz) — submission timestamp
```

**Verification query** (run in Supabase SQL Editor):
```sql
-- Check contact_submissions table exists
SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 10;

-- Should show recent form submissions
```

---

## Setup Instructions for Existing Databases

### If you're using an EXISTING Supabase database:

1. **Go to Supabase Dashboard** → Select your project → SQL Editor

2. **Run these migration queries individually**:

```sql
-- Add missing columns to users table (if they don't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR;
```

3. **Verify the columns were added**:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users';
```

4. **Ensure RLS policies allow writes** (should already exist):
```sql
-- Check UPDATE policy
SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%update%';

-- Should show policy allowing users to update their own profile
```

### If creating a NEW database:

The columns are now included in `migrations.sql`, so new databases will have them automatically.

---

## Testing the Forms

### Test Profile Completion:
1. Sign up with OAuth (Google/GitHub)
2. Complete profile form with all fields:
   - Company: "Test Corp"
   - Job Title: "CEO"
   - Phone: "+1 555-123-4567" (country code: +1)
   - Subject: "AI Governance"
   - How did you hear: "LinkedIn"
   - Message: "Test message"
   - Attachments: Upload a PDF
3. Click "Continue to Dashboard"
4. Verify in Supabase:
   ```sql
   SELECT company, job_title, phone FROM users WHERE id = '[current_user_id]';
   ```
   Should show the entered data.

### Test Contact Form:
1. Go to `/contact` page
2. Fill form with all fields
3. Click "Send Message"
4. Verify in Supabase:
   ```sql
   SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 1;
   ```
   Should show your submission.

---

## Email Notifications

Both forms trigger email notifications:

### Profile Completion → Team Notification
Sent to `GMAIL_USER` with:
- User name, email
- Company, job title, phone
- Subject, message, how_heard
- Provider (OAuth method)

### Contact Submission → Dual Email
1. **Team notification** - All submission details
2. **Auto-reply to sender** - Confirmation email

Both use templates in `/lib/mailer.ts`

---

## Database Schema Reference

### New columns added to `users` table (April 9, 2026):

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR NULL;
ALTER TABLE users ADD COLUMN company VARCHAR NULL;
ALTER TABLE users ADD COLUMN job_title VARCHAR NULL;
```

### Existing `contact_submissions` table:

Already exists and stores all contact form data including:
- dial_code + phone (separate fields)
- company, subject, message
- attachment_names array
- how_heard dropdown selection
