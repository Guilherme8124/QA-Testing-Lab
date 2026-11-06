
const SUPABASE_URL = "https://kkxmzusjpuhdzsaiyfuo.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_O7LPJI4y2obZWBtblM6O6Q_gJxZCRgL";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;
