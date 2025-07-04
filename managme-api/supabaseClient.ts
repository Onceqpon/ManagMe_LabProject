import { createClient } from '@supabase/supabase-js'

// TODO: Zastąp poniższe wartości swoimi danymi z panelu Supabase
// (Settings -> API)
const supabaseUrl = 'https://txjmxbaxkiupbxqophkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4am14YmF4a2l1cGJ4cW9waGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjQ0NzYsImV4cCI6MjA2NzE0MDQ3Nn0.3IrUBolCEp8uzhktHOuAfUD-2PeFZrIO__UpQLi_sVU';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Błąd: Brak kluczy konfiguracyjnych Supabase. Sprawdź plik supabaseClient.ts");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
