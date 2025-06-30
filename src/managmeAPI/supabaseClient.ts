import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bhhddonanthuxnnlpdsq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoaGRkb25hbnRodXhubmxwZHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyODA4MzcsImV4cCI6MjA2NDg1NjgzN30.lNl7s1m2Wm4-kvYDk3fUl9k3YB3g-q94WCHXFUOuBhE' 

export const supabase = createClient(supabaseUrl, supabaseKey)