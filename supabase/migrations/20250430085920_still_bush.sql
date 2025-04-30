/*
  # Add transactions table for syncing offline data

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `type` (varchar)
      - `data` (jsonb)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Insert their own transactions
      - Read their own transactions
*/

CREATE TABLE transactions (
  id uuid PRIMARY KEY,
  type varchar(20) NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);