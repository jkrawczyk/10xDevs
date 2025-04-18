-- Migration: Create user_settings table
-- Description: Creates the user settings table for storing user preferences
-- with appropriate RLS policies for data security

-- Create the user_settings table
create table user_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    default_correction_style varchar not null,
    constraint default_correction_style_check check (default_correction_style in ('formal', 'natural'))
);

-- Enable row level security
alter table user_settings enable row level security;

-- Create policies for authenticated users
create policy "Users can view own settings"
    on user_settings
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert own settings"
    on user_settings
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update own settings"
    on user_settings
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete own settings"
    on user_settings
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Deny access for anonymous users
create policy "Deny anonymous settings access"
    on user_settings
    for all
    to anon
    using (false);

-- Add comment to the table
comment on table user_settings is 'Stores user preferences and settings'; 