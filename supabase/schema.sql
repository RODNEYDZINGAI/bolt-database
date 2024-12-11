-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- User Profiles Table
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text not null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_login timestamp with time zone,
    constraint username_length check (char_length(full_name) >= 3)
);

-- Subscription Plans Table
create table public.subscription_plans (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    price decimal(10,2) not null,
    interval text not null check (interval in ('monthly', 'yearly')),
    features jsonb not null default '[]'::jsonb,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Subscriptions Table
create table public.user_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    plan_id uuid references public.subscription_plans(id) on delete restrict not null,
    status text not null check (status in ('active', 'cancelled', 'expired')),
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    cancel_at_period_end boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Calculator Usage Tracking
create table public.calculator_usage (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    calculator_type text not null,
    calculator_name text not null,
    used_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Settings/Preferences
create table public.user_preferences (
    user_id uuid references public.profiles(id) on delete cascade primary key,
    theme text default 'system' check (theme in ('light', 'dark', 'system')),
    notification_preferences jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default subscription plans
insert into public.subscription_plans (name, description, price, interval, features) values
    ('Free', 'Basic access to essential calculators', 0.00, 'monthly', '[
        "Basic Calculator",
        "Percentage Calculator"
    ]'::jsonb),
    ('Premium Monthly', 'Full access to all premium features', 9.99, 'monthly', '[
        "All Free Features",
        "Scientific Calculator",
        "Graphing Calculator",
        "Priority Support"
    ]'::jsonb),
    ('Premium Yearly', 'Full access with yearly discount', 99.99, 'yearly', '[
        "All Free Features",
        "Scientific Calculator",
        "Graphing Calculator",
        "Priority Support",
        "20% Discount"
    ]'::jsonb);

-- Create triggers for automatic timestamp updates
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for profiles
create trigger handle_updated_at_profiles
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

-- Create trigger for user_subscriptions
create trigger handle_updated_at_user_subscriptions
    before update on public.user_subscriptions
    for each row
    execute function public.handle_updated_at();

-- Create trigger for user_preferences
create trigger handle_updated_at_user_preferences
    before update on public.user_preferences
    for each row
    execute function public.handle_updated_at();

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, created_at, updated_at)
    values (new.id, new.email, now(), now());
    
    -- Insert default preferences
    insert into public.user_preferences (user_id)
    values (new.id);
    
    -- Assign free subscription plan
    insert into public.user_subscriptions (
        user_id,
        plan_id,
        status,
        current_period_start,
        current_period_end
    )
    select
        new.id,
        id,
        'active',
        now(),
        (now() + interval '100 years')
    from public.subscription_plans
    where name = 'Free'
    limit 1;
    
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.calculator_usage enable row level security;
alter table public.user_preferences enable row level security;
alter table public.subscription_plans enable row level security;

-- Policies for profiles
create policy "Users can view own profile"
    on public.profiles for select
    using ( auth.uid() = id );

create policy "Users can update own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- Policies for subscriptions
create policy "Users can view own subscription"
    on public.user_subscriptions for select
    using ( auth.uid() = user_id );

-- Policies for calculator usage
create policy "Users can view own calculator usage"
    on public.calculator_usage for select
    using ( auth.uid() = user_id );

create policy "Users can insert own calculator usage"
    on public.calculator_usage for insert
    with check ( auth.uid() = user_id );

-- Policies for user preferences
create policy "Users can view own preferences"
    on public.user_preferences for select
    using ( auth.uid() = user_id );

create policy "Users can update own preferences"
    on public.user_preferences for update
    using ( auth.uid() = user_id );

-- Policies for subscription plans
create policy "Anyone can view subscription plans"
    on public.subscription_plans for select
    using ( true );
