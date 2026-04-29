-- Create stories table
create table public.stories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  overview text default '',
  characters text default '',
  plot text default '',
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.stories enable row level security;

-- Create policies
create policy "Users can view own stories"
on stories for select
using (auth.uid() = user_id);

create policy "Users can insert own stories"
on stories for insert
with check (auth.uid() = user_id);

create policy "Users can update own stories"
on stories for update
using (auth.uid() = user_id);

create policy "Users can delete own stories"
on stories for delete
using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_stories_user_id on stories(user_id);
create index idx_stories_updated_at on stories(updated_at);