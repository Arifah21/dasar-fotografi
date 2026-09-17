// js/supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://prcljjmitsebturrwtli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2xqam1pdHNlYnR1cnJ3dGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NTgzNjcsImV4cCI6MjEwNTEzNDM2N30.nTJSYyR1hLtF1k6vRYn4fnTb4So_1wfVEdChaQKpyuY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);