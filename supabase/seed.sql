-- Seed data for testing — DO NOT use in production
-- This file adds sample transactions for dashboard testing

-- Note: In development, you can insert sample transactions directly if you have a user
-- Replace 'YOUR_USER_ID' with an actual user ID from your auth.users table

-- Example insert (adjust user_id to a real user):
-- INSERT INTO public.transactions (user_id, type, category, amount, description, transaction_date)
-- VALUES
--   ('user-uuid-here', 'income', 'Ride', 45.00, 'Uber trip - Downtown', NOW() - INTERVAL '2 days'),
--   ('user-uuid-here', 'income', 'Ride', 32.50, '99 trip - Airport', NOW() - INTERVAL '1 day'),
--   ('user-uuid-here', 'expense', 'Fuel', 80.00, 'Shell gas station', NOW() - INTERVAL '1 day'),
--   ('user-uuid-here', 'expense', 'Maintenance', 150.00, 'Oil change', NOW() - INTERVAL '3 days'),
--   ('user-uuid-here', 'income', 'Ride', 28.00, 'InDrive trip', NOW()),
--   ('user-uuid-here', 'expense', 'Tolls', 15.00, 'Highway toll', NOW());

-- To seed with real data:
-- 1. Find a test user ID in the Supabase dashboard (auth > users)
-- 2. Replace the commented INSERT statements with real data
-- 3. Run: supabase db push
