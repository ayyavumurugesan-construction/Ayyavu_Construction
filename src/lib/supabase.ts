import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jibhyuwqbfunqagyfkgx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppYmh5dXdxYmZ1bnFhZ3lma2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDI0MDgsImV4cCI6MjA4NDk3ODQwOH0.1j2EkNM7nSaRVfmbp9mMKKhUoRhjnTc9XI_ihlfHU88'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PropertyListing = {
  id: string
  title: string
  description: string
  price: string
  area: string
  location: string
  property_type: 'residential' | 'commercial'
  contact_name: string
  contact_phone: string
  contact_email: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  user_id: string
  created_at: string
  updated_at: string
}