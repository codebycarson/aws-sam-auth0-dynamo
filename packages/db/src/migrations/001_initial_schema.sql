-- Example migration file
-- Run this SQL in your Supabase SQL editor or via the Supabase CLI

-- Create user_data table
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_data_updated_at ON user_data;
CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own data
CREATE POLICY "Users can view their own data"
  ON user_data
  FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert their own data"
  ON user_data
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own data"
  ON user_data
  FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id)
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete their own data"
  ON user_data
  FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);
