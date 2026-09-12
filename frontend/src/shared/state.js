/* ==========================================================================
   MOCK DATA (Dados Simulados para Protótipo)
   ========================================================================== */
let BUILDINGS_DATA = [
    { id: 'bloco-a', name: 'Bloco A - Sol Nascente', units: 120, occupied: 112, manager: 'Ricardo Souza', rate: 93.3, startNum: 1, suffix: '', subdivisions: [{ name: 'Ala Norte', units: 60, startNum: 1, suffix: 'n' }, { name: 'Ala Sul', units: 60, startNum: 1, suffix: 's' }], theme: 'orange' },
    { id: 'bloco-b', name: 'Bloco B - Sol Nascente', units: 110, occupied: 104, manager: 'Camila Lima', rate: 94.5, startNum: 1, suffix: 'b', subdivisions: [], theme: 'green' },
    { id: 'bloco-c', name: 'Lofts T-10 Bueno', units: 100, occupied: 90, manager: 'Felipe Alves', rate: 90.0, startNum: 101, suffix: '', subdivisions: [], theme: 'pink' },
    { id: 'bloco-d', name: 'Residencial Oeste', units: 120, occupied: 110, manager: 'Beatriz Rocha', rate: 91.6, startNum: 1, suffix: '', subdivisions: [{ name: 'Torre 1', units: 60, startNum: 1, suffix: 't1' }, { name: 'Torre 2', units: 60, startNum: 1, suffix: 't2' }], theme: 'purple' },
    { id: 'bloco-japao', name: 'Residencial Japão', units: 102, occupied: 90, manager: 'Ricardo Souza', rate: 88.2, startNum: 1, suffix: '', subdivisions: [{ name: 'Japão', units: 88, startNum: 1, suffix: 'j' }, { name: 'Barracão B', units: 6, startNum: 1, suffix: 'b' }, { name: 'Barracão X', units: 8, startNum: 1, suffix: 'x' }], theme: 'default' }
];

const CONTRACTS_EXPIRING = [
    { tenant: 'Mariana Silva de Jesus', phone: '(62) 99874-1122', unit: 'Apto 104 - Bloco A', expiry: '15/07/2026', buildingId: 'bloco-a' },
    { tenant: 'Carlos Eduardo Nogueira', phone: '(62) 98404-9988', unit: 'Loft 202 - T-10 Bueno', expiry: '22/07/2026', buildingId: 'bloco-c' },
    { tenant: 'Patrícia Maria de Souza', phone: '(62) 99122-3344', unit: 'Apto 305 - Bloco B', expiry: '29/07/2026', buildingId: 'bloco-b' }
];

/* Dados Mockados de Usuários */
let USERS_DATA = [
    { id: 'usr-1', name: 'Carlos Bueno', email: 'carlos.bueno@buenoresidence.com', role: 'admin', building: 'Todos os Prédios', buildingId: 'all', active: true },
    { id: 'usr-2', name: 'Mariana Costa', email: 'mariana.costa@buenoresidence.com', role: 'gerente', building: 'Geral', buildingId: 'all', active: true },
    { id: 'usr-3', name: 'Ricardo Souza', email: 'ricardo.souza@buenoresidence.com', role: 'gestor', building: 'Bloco A - Sol Nascente', buildingId: 'bloco-a', active: true },
    { id: 'usr-4', name: 'Camila Lima', email: 'camila.lima@buenoresidence.com', role: 'gestor', building: 'Bloco B - Sol Nascente', buildingId: 'bloco-b', active: true },
    { id: 'usr-5', name: 'Dev Antigravity', email: 'dev@buenoresidence.com', role: 'developer', building: 'Acesso Técnico', buildingId: 'all', active: true },
    { id: 'usr-6', name: 'Paulo Neto', email: 'paulo.neto@buenoresidence.com', role: 'financeiro', building: 'Financeiro', buildingId: 'all', active: true }
];

/* Dados Mockados de Logs de Auditoria */
let AUDIT_LOGS = [
    { user: 'Carlos Bueno', role: 'admin', action: 'Visualizou dashboard consolidado', time: '08/07/2026 20:15:22', ip: '192.168.1.100 (Windows)' },
    { user: 'Mariana Costa', role: 'gerente', action: 'Enviou lembrete de aluguel para Mariana Silva', time: '08/07/2026 19:30:10', ip: '192.168.1.102 (Android)' },
    { user: 'Ricardo Souza', role: 'gestor', action: 'Acessou painel local do Bloco A', time: '08/07/2026 18:45:00', ip: '192.168.1.105 (iOS)' },
    { user: 'Carlos Bueno', role: 'admin', action: 'Atualizou configurações de rede', time: '08/07/2026 16:20:41', ip: '192.168.1.100 (Windows)' }
];

/* Configuração Simulada do Google Drive */
let DRIVE_CONFIG = {
    clientId: '',
    apiKey: '',
    folderId: 'BuenoResidence_Contratos',
    connected: false
};

/* Configurações Adicionais do Desenvolvedor */
let DRIVE_PAUSED = false;
let CLICK_PAUSED = false;
let CLICK_CONFIG = {
    token: '',
    spaceId: '',
    listId: '',
    connected: false
};
let FINANCIAL_APIS = {
    efi: { clientId: '', clientSecret: '', mode: 'sandbox', connected: false },
    bradesco: { clientId: '', connected: false },
    c6: { clientId: '', secret: '', connected: false }
};
let DEV_ERROR_LOGS = [
    { timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleString('pt-BR'), service: 'Google Drive', message: 'Rate limit exceeded on folder generation API call', severity: 'Média', status: '429 Too Many Requests' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleString('pt-BR'), service: 'Bradesco API', message: 'SSL Handshake failed: Invalid client certificate', severity: 'Alta', status: '495 Cert Error' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleString('pt-BR'), service: 'Efí / Gerencianet', message: 'Client credentials verification failed', severity: 'Alta', status: '401 Unauthorized' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 300).toLocaleString('pt-BR'), service: 'Click API', message: 'Resource not found: Space ID 98765432 does not exist', severity: 'Baixa', status: '404 Not Found' }
];

/* Dados Mockados do Financeiro (Relatórios Semanais) */
let MOCK_WEEKLY_REPORTS = [
    { date: '10/07/2026', tenant: 'Marcos Oliveira', unit: 'Apto 101 - Bloco A', type: 'Saída', detail: 'Desocupação voluntária. Saiu com aluguel quitado e vistoria aprovada.' },
    { date: '11/07/2026', tenant: 'Gisele Santos', unit: 'Apto 204 - Bloco C', type: 'Entrada', detail: 'Nova moradora. Contrato de 12 meses assinado digitalmente.' },
    { date: '12/07/2026', tenant: 'Fernando Ribeiro (Ex-Morador)', unit: 'Apto 302 - Bloco B', type: 'Quitação', detail: 'Retornou para quitar aluguel em atraso vencido em Maio/2026. Recebido em dinheiro.' },
    { date: '14/07/2026', tenant: 'Juliana Mendes', unit: 'Apto 108 - Bloco D', type: 'Saída (Inadimplente)', detail: 'Desocupação judicial por inadimplência reiterada. Deixou saldo devedor de R$ 3.400,00.' }
];

let MOCK_CASH_BOOK = [
    { id: 'caixa-m1', date: '10/07/2026', type: 'Entrada', description: 'Pagamento de Aluguel - Dinheiro vivo', unit: 'Apto 402 - Bloco A', value: 1450.00 },
    { id: 'caixa-m2', date: '11/07/2026', type: 'Saída', description: 'Compra de materiais de limpeza - dinheiro do caixa', unit: '', value: 180.00 },
    { id: 'caixa-m3', date: '12/07/2026', type: 'Entrada', description: 'Quitação de dívida de ex-morador (Fernando Ribeiro)', unit: 'Apto 302 - Bloco B', value: 1200.00 },
    { id: 'caixa-m4', date: '13/07/2026', type: 'Saída', description: 'Pequeno reparo hidráulico emergencial - portaria', unit: '', value: 350.00 },
    { id: 'caixa-m5', date: '15/07/2026', type: 'Entrada', description: 'Taxa de mudança recebida em espécie', unit: 'Apto 204 - Bloco C', value: 150.00 }
];

let CAIXA_DATA = [];

// id único para cada registro de depósito
var PIX_DEPOSITS_DATA = [
    { id: 'pix-1', date: '10/07/2026', time: '09:15', tenantId: '', tenant: 'Ana Souza', unit: 'Apto 1n - Bloco A', value: 900.00, type: 'parte', obs: 'Primeira parte do aluguel' },
    { id: 'pix-2', date: '12/07/2026', time: '14:05', tenantId: '', tenant: 'Ana Souza', unit: 'Apto 1n - Bloco A', value: 600.00, type: 'restante', obs: 'Complemento da primeira parte' },
    { id: 'pix-3', date: '10/07/2026', time: '11:32', tenantId: '', tenant: 'Eduardo Ferreira', unit: 'Apto 4n - Bloco A', value: 1650.00, type: 'integral', obs: '' },
    { id: 'pix-4', date: '10/07/2026', time: '14:02', tenantId: '', tenant: 'Camila Lima', unit: 'Apto 102b - Bloco B', value: 1400.00, type: 'integral', obs: '' },
    { id: 'pix-5', date: '11/07/2026', time: '18:41', tenantId: '', tenant: 'Bruno Santos', unit: 'Apto 12n - Bloco A', value: 750.00, type: 'parte', obs: 'Primeira parcela' }
];

/* Dados de Unidades do Condomínio */
let UNITS_DATA = [];
let activeBuildingId = '';
let activeUnitId = '';
let editingBuildingId = null;

/* Estado da Aplicação */
let currentUser = {
    role: 'admin',
    name: 'Carlos Bueno',
    building: 'Todos os Prédios',
    buildingId: 'all'
};

/* ==========================================================================
   PERSISTÊNCIA LOCAL (localStorage)
   ========================================================================== */
let CONTRACTS_DATA = [];
let TENANTS_DATA = [];
let PAYMENTS_DATA = [];
let MAINTENANCE_DATA = [];
let EXPENSES_DATA = [];
let REPORTS_ARCHIVE = [];

const API_URL = '/api';

// Configuração do Supabase (Frontend Client para Auth e Storage)
const supabaseUrl = 'https://stfylwyfqogfxtyhahxs.supabase.co';
const supabaseKey = 'sb_publishable_RJiGYSUW_N8_1SI1LXkZ-Q_sfw0yZ-M';
// Capturar hash da URL antes que o Supabase o limpe
const initialHash = window.location.hash;
let isInviteFlow = false;
if (initialHash && (initialHash.includes('type=invite') || initialHash.includes('type=recovery'))) {
    isInviteFlow = true;
}

let supabaseClient;
if (window.supabase) {
    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Suporte para PKCE Flow e Hash Flow
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' || isInviteFlow) {
            isInviteFlow = true;
            const loginForm = document.getElementById('login-form');
            const setPasswordForm = document.getElementById('set-password-form');
            if (loginForm && setPasswordForm) {
                loginForm.style.display = 'none';
                setPasswordForm.style.display = 'block';
            }
        }
    });
}

async function syncToBackend() {
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch(`${API_URL}/contracts`, { method: 'POST', headers, body: JSON.stringify(CONTRACTS_DATA) });
        await fetch(`${API_URL}/cashbox`, { method: 'POST', headers, body: JSON.stringify(CAIXA_DATA) });
        
        await fetch(`${API_URL}/units`, { method: 'POST', headers, body: JSON.stringify(UNITS_DATA) });
        await fetch(`${API_URL}/tenants`, { method: 'POST', headers, body: JSON.stringify(TENANTS_DATA) });
        await fetch(`${API_URL}/pix_deposits`, { method: 'POST', headers, body: JSON.stringify(PIX_DEPOSITS_DATA) });
        await fetch(`${API_URL}/maintenance`, { method: 'POST', headers, body: JSON.stringify(MAINTENANCE_DATA) });
        await fetch(`${API_URL}/expenses`, { method: 'POST', headers, body: JSON.stringify(EXPENSES_DATA) });
        await fetch(`${API_URL}/audit_logs`, { method: 'POST', headers, body: JSON.stringify(AUDIT_LOGS) });
        // Log is handled separately, usually single inserts.
    } catch (e) {
        console.error('Erro ao salvar no backend Supabase:', e);
    }
}

async function loadFromBackend() {
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const fetches = [
            fetch(`${API_URL}/contracts`, { headers }),
            fetch(`${API_URL}/cashbox`, { headers }),
            fetch(`${API_URL}/units`, { headers }),
            fetch(`${API_URL}/tenants`, { headers }),
            fetch(`${API_URL}/pix_deposits`, { headers }),
            fetch(`${API_URL}/maintenance`, { headers }),
            fetch(`${API_URL}/expenses`, { headers }),
            fetch(`${API_URL}/audit_logs`, { headers })
        ];
        const responses = await Promise.all(fetches);
        
        const parseJson = async (res, assignFunc) => {
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) assignFunc(data);
            }
        };

        await parseJson(responses[0], d => CONTRACTS_DATA = d);
        await parseJson(responses[1], d => CAIXA_DATA = d);
        await parseJson(responses[2], d => UNITS_DATA = d);
        await parseJson(responses[3], d => TENANTS_DATA = d);
        await parseJson(responses[4], d => PIX_DEPOSITS_DATA = d);
        await parseJson(responses[5], d => MAINTENANCE_DATA = d);
        await parseJson(responses[6], d => EXPENSES_DATA = d);
        await parseJson(responses[7], d => AUDIT_LOGS = d);

    } catch (e) {
        console.error('Erro ao carregar do backend Supabase:', e);
    }
}

function saveState() {
    localStorage.setItem('bueno_buildings_data', JSON.stringify(BUILDINGS_DATA));
    localStorage.setItem('bueno_users_data', JSON.stringify(USERS_DATA));
    localStorage.setItem('bueno_units_data', JSON.stringify(UNITS_DATA));
    localStorage.setItem('bueno_audit_logs', JSON.stringify(AUDIT_LOGS));
    localStorage.setItem('bueno_drive_config', JSON.stringify(DRIVE_CONFIG));
    localStorage.setItem('bueno_contracts_data', JSON.stringify(CONTRACTS_DATA));
    localStorage.setItem('bueno_tenants_data', JSON.stringify(TENANTS_DATA));
    localStorage.setItem('bueno_payments_data', JSON.stringify(PAYMENTS_DATA));
    localStorage.setItem('bueno_maintenance_data', JSON.stringify(MAINTENANCE_DATA));
    localStorage.setItem('bueno_expenses_data', JSON.stringify(EXPENSES_DATA));
    localStorage.setItem('bueno_pix_deposits', JSON.stringify(PIX_DEPOSITS_DATA));
    localStorage.setItem('bueno_caixa_data', JSON.stringify(CAIXA_DATA));
    localStorage.setItem('bueno_reports_archive', JSON.stringify(REPORTS_ARCHIVE));
    
    // Configurações do Desenvolvedor
    localStorage.setItem('bueno_drive_paused', JSON.stringify(DRIVE_PAUSED));
    localStorage.setItem('bueno_click_paused', JSON.stringify(CLICK_PAUSED));
    localStorage.setItem('bueno_click_config', JSON.stringify(CLICK_CONFIG));
    localStorage.setItem('bueno_financial_apis', JSON.stringify(FINANCIAL_APIS));
    localStorage.setItem('bueno_dev_error_logs', JSON.stringify(DEV_ERROR_LOGS));
    
    // Sync em background para o Supabase (Fase 2)
    syncToBackend();
}

function loadState() {
    const savedBuildings = localStorage.getItem('bueno_buildings_data');
    const savedUsers = localStorage.getItem('bueno_users_data');
    const savedUnits = localStorage.getItem('bueno_units_data');
    const savedLogs = localStorage.getItem('bueno_audit_logs');
    const savedDrive = localStorage.getItem('bueno_drive_config');
    const savedContracts = localStorage.getItem('bueno_contracts_data');
    const savedTenants = localStorage.getItem('bueno_tenants_data');
    
    if (savedBuildings) BUILDINGS_DATA = JSON.parse(savedBuildings);
    if (savedUsers) {
        USERS_DATA = JSON.parse(savedUsers);
        // Garante que o usuário desenvolvedor existe após o parse de dados salvos anteriormente
        if (!USERS_DATA.find(u => u.role === 'developer')) {
            USERS_DATA.push({ id: 'usr-5', name: 'Dev Antigravity', email: 'dev@buenoresidence.com', role: 'developer', building: 'Acesso Técnico', buildingId: 'all', active: true });
        }
        // Garante que o usuário financeiro existe
        if (!USERS_DATA.find(u => u.role === 'financeiro')) {
            USERS_DATA.push({ id: 'usr-6', name: 'Paulo Neto', email: 'paulo.neto@buenoresidence.com', role: 'financeiro', building: 'Financeiro', buildingId: 'all', active: true });
        }
        localStorage.setItem('bueno_users_data', JSON.stringify(USERS_DATA));
    }
    if (savedUnits) UNITS_DATA = JSON.parse(savedUnits);
    if (savedLogs) AUDIT_LOGS = JSON.parse(savedLogs);
    if (savedDrive) DRIVE_CONFIG = JSON.parse(savedDrive);
    if (savedContracts) CONTRACTS_DATA = JSON.parse(savedContracts);
    if (savedTenants) {
        TENANTS_DATA = JSON.parse(savedTenants);
        let tenantsUpdated = false;
        TENANTS_DATA.forEach(t => {
            if (t.dueDay === undefined) {
                const unitName = t.history && t.history[0] ? t.history[0].unitNumber : '1';
                const unitNum = parseInt(unitName) || 1;
                t.dueDay = (unitNum % 10 === 1 || unitNum % 10 === 3) ? 10 : (unitNum % 10 === 5 || unitNum % 10 === 7 ? 10 : (unitNum % 10 === 2 || unitNum % 10 === 4 ? 15 : 20));
                t.rentStatus = (unitNum % 10 === 1 || unitNum % 10 === 3) ? 'em_aberto' : 'pago';
                t.rentValue = (t.history && t.history[0] ? t.history[0].rent : 1500) || 1500;
                tenantsUpdated = true;
            }
        });
        if (tenantsUpdated) {
            localStorage.setItem('bueno_tenants_data', JSON.stringify(TENANTS_DATA));
        }
    }
    
    // Desenvolvedor
    const savedDrivePaused = localStorage.getItem('bueno_drive_paused');
    const savedClickPaused = localStorage.getItem('bueno_click_paused');
    const savedClickConfig = localStorage.getItem('bueno_click_config');
    const savedFinApis = localStorage.getItem('bueno_financial_apis');
    const savedDevErrors = localStorage.getItem('bueno_dev_error_logs');
    
    if (savedDrivePaused) DRIVE_PAUSED = JSON.parse(savedDrivePaused);
    if (savedClickPaused) CLICK_PAUSED = JSON.parse(savedClickPaused);
    if (savedClickConfig) CLICK_CONFIG = JSON.parse(savedClickConfig);
    if (savedFinApis) FINANCIAL_APIS = JSON.parse(savedFinApis);
    if (savedDevErrors) DEV_ERROR_LOGS = JSON.parse(savedDevErrors);

    // Finanças
    const pData = localStorage.getItem('bueno_payments_data');
    if (pData) PAYMENTS_DATA = JSON.parse(pData);
    
    const mData = localStorage.getItem('bueno_maintenance_data');
    if (mData) MAINTENANCE_DATA = JSON.parse(mData);
    
    const eData = localStorage.getItem('bueno_expenses_data');
    if (eData) EXPENSES_DATA = JSON.parse(eData);
    
    const pixData = localStorage.getItem('bueno_pix_deposits');
    if (pixData) PIX_DEPOSITS_DATA = JSON.parse(pixData);

    const cData = localStorage.getItem('bueno_caixa_data');
    if (cData) {
        CAIXA_DATA = JSON.parse(cData);
    } else {
        CAIXA_DATA = [...MOCK_CASH_BOOK];
    }

    const rData = localStorage.getItem('bueno_reports_archive');
    if (rData) REPORTS_ARCHIVE = JSON.parse(rData);
}

// Expor funções globalmente para depuração
window.saveState = saveState;
window.loadState = loadState;
window.CONTRACTS_DATA = CONTRACTS_DATA;
window.TENANTS_DATA = TENANTS_DATA;
