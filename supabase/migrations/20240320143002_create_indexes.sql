-- Migration: Create indexes for performance optimization
-- Description: Adds indexes to improve query performance on frequently accessed columns

-- Add index for user_id on corrections table
create index idx_corrections_user_id on corrections(user_id);

-- Add index for created_at on corrections table to optimize time-based queries
create index idx_corrections_created_at on corrections(created_at);

-- Add comment explaining the indexes
comment on index idx_corrections_user_id is 'Improves performance of queries filtering by user_id';
comment on index idx_corrections_created_at is 'Improves performance of queries sorting or filtering by creation date'; 