-- Migration: Create corrections table
-- Description: Creates the main corrections table for storing user text corrections
-- with appropriate RLS policies for data security

-- Create the corrections table
create table corrections (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    original_text varchar(2000) not null,
    approved_text text not null,
    correction_style varchar not null,
    created_at timestamp with time zone default now() not null,
    constraint correction_style_check check (correction_style in ('formal', 'natural'))
);

-- Enable row level security
alter table corrections enable row level security;

-- Create policies for authenticated users
create policy "Users can view own corrections"
    on corrections
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own corrections"
    on corrections
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own corrections"
    on corrections
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete own corrections"
    on corrections
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Deny access for anonymous users
create policy "Deny anonymous access"
    on corrections
    for all
    to anon
    using (false);

-- Add comment to the table
comment on table corrections is 'Stores text corrections submitted by users'; 