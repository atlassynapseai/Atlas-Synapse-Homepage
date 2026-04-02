-- Run this in your Supabase SQL editor
-- Dashboard → SQL Editor → New query → paste → Run

create table if not exists contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  dial_code     text,
  phone         text,
  company       text,
  subject       text,
  message       text not null,
  how_heard     text,
  attachment_names text[],
  status        text not null default 'new', -- new | contacted | closed
  created_at    timestamptz not null default now()
);

-- Index for quick lookup by email or date
create index if not exists contact_submissions_email_idx      on contact_submissions (email);
create index if not exists contact_submissions_created_at_idx on contact_submissions (created_at desc);

-- Enable RLS — service role bypasses this, public gets nothing
alter table contact_submissions enable row level security;
