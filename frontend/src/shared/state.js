/* Estado mínimo de sessão e configuração pública do frontend. */
let currentUser = {
    id: null,
    role: null,
    name: '',
    building: '',
    buildingId: null
};

const LEGACY_STORAGE_KEYS = [
    'bueno_buildings_data',
    'bueno_users_data',
    'bueno_units_data',
    'bueno_audit_logs',
    'bueno_drive_config',
    'bueno_contracts_data',
    'bueno_tenants_data',
    'bueno_payments_data',
    'bueno_maintenance_data',
    'bueno_expenses_data',
    'bueno_pix_deposits',
    'bueno_caixa_data',
    'bueno_reports_archive',
    'bueno_drive_paused',
    'bueno_click_paused',
    'bueno_click_config',
    'bueno_financial_apis',
    'bueno_dev_error_logs',
    'bueno_weekly_draft'
];

function clearLegacyBrowserState() {
    try {
        for (const key of LEGACY_STORAGE_KEYS) window.localStorage.removeItem(key);
    } catch (_error) {
        // A indisponibilidade do armazenamento local não pode bloquear o login.
    }
}
clearLegacyBrowserState();

const supabaseUrl = window.BUENO_CONFIG?.supabaseUrl || '';
const supabaseKey = window.BUENO_CONFIG?.supabasePublishableKey || '';
const initialHash = window.location.hash;
let isInviteFlow = Boolean(initialHash && (initialHash.includes('type=invite') || initialHash.includes('type=recovery')));
let supabaseClient;

if (window.supabase && supabaseUrl && supabaseKey) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    supabaseClient.auth.onAuthStateChange((event) => {
        if (event !== 'PASSWORD_RECOVERY' && !isInviteFlow) return;
        isInviteFlow = true;
        const loginForm = document.getElementById('login-form');
        const setPasswordForm = document.getElementById('set-password-form');
        if (loginForm && setPasswordForm) {
            loginForm.style.display = 'none';
            setPasswordForm.style.display = 'block';
        }
    });
}
