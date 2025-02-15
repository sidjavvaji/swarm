import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubkjlzsjjgrujbfszvgf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia2psenNqamdydWpiZnN6dmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MDE0NDgsImV4cCI6MjA1NTE3NzQ0OH0.swqIPjwUxK6mPsZtA8y-fvxr0gg2nf-grudKtgCZYSw';

export const supabase = createClient(supabaseUrl, supabaseKey); 