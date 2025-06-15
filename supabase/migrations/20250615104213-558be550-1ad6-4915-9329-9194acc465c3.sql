
-- Create an enum for common countries and their currencies (if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE public.country_info AS ENUM (
      'US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'CH', 'SG', 'HK', 'ZA'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  country country_info NOT NULL,
  currency_code TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Recreate the function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, country, currency_code, currency_symbol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'country')::country_info, 'US'),
    COALESCE(NEW.raw_user_meta_data ->> 'currency_code', 'USD'),
    COALESCE(NEW.raw_user_meta_data ->> 'currency_symbol', '$')
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
