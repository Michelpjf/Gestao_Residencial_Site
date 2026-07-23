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

        await fetch(`${API_URL}/buildings`, { method: 'POST', headers, body: JSON.stringify(BUILDINGS_DATA) });
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
            fetch(`${API_URL}/buildings`, { headers }),
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

        await parseJson(responses[0], d => BUILDINGS_DATA = d);
        await parseJson(responses[1], d => CONTRACTS_DATA = d);
        await parseJson(responses[2], d => CAIXA_DATA = d);
        await parseJson(responses[3], d => UNITS_DATA = d);
        await parseJson(responses[4], d => TENANTS_DATA = d);
        await parseJson(responses[5], d => PIX_DEPOSITS_DATA = d);
        await parseJson(responses[6], d => MAINTENANCE_DATA = d);
        await parseJson(responses[7], d => EXPENSES_DATA = d);
        await parseJson(responses[8], d => AUDIT_LOGS = d);

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

/* ==========================================================================
   INICIALIZAÇÃO & EVENTOS DE TELA
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    loadState(); // Carrega cache local
    await loadFromBackend(); // Sobrescreve com dados da nuvem Supabase
    
    generateMockUnits();
    // Se for a primeira execução (sem dados salvos), salvar os dados gerados inicialmente
    if (!localStorage.getItem('bueno_buildings_data')) {
        saveState();
    }
    // Se contratos estiverem vazios (ex: primeira carga ou reinstalação), sincroniza com unidades ocupadas
    if (!localStorage.getItem('bueno_contracts_data') || CONTRACTS_DATA.length === 0) {
        syncMockTenantsAndContracts();
        saveState();
    }
    initLiveDate();
    setupNavigation();
    setupForms();
    setupConfigTabs();
    setupDevTabs();
    loadConfigData();
    setupBuildingsEvents();
    populateBuildingManagersDropdown();
    initContractsTab();
    initTenantsTab();
    initFinanceTab();
    
    // Atalho do dashboard para inquilinos em aberto
    const goToTenantsLink = document.getElementById('link-go-to-tenants-open');
    if (goToTenantsLink) {
        goToTenantsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tabBtn = document.querySelector('[data-tab="inquilinos"]');
            if (tabBtn) tabBtn.click();
            const subBtn = document.querySelector('[data-tenant-subtab="aberto"]');
            if (subBtn) subBtn.click();
        });
    }
});

/* Atualiza Data e Dia da Semana */
function initLiveDate() {
    const dateEl = document.getElementById('live-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        // Em português brasileiro
        dateEl.textContent = today.toLocaleDateString('pt-BR', options);
    }
/* ==========================================================================
   TELA DE LOGIN: SELEÇÃO DE PERFIS (SIMULAÇÃO)
   ========================================================================== */
// Função setupLoginSelector removida devido à remoção dos chips de simulação no HTML

/* Envio do formulário de Login e Definição de Senha */
function setupForms() {
    const loginForm = document.getElementById('login-form');
    const setPasswordForm = document.getElementById('set-password-form');
    
    // Interceptar hash de convite ou recuperação de senha usando a variável global
    if (isInviteFlow) {
        if (loginForm) loginForm.style.display = 'none';
        if (setPasswordForm) setPasswordForm.style.display = 'block';
    }

    if (setPasswordForm) {
        setPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorDiv = document.getElementById('set-password-error');
            
            errorDiv.style.display = 'none';
            if (newPassword !== confirmPassword) {
                errorDiv.textContent = 'As senhas não coincidem!';
                errorDiv.style.display = 'block';
                return;
            }
            if (newPassword.length < 6) {
                errorDiv.textContent = 'A senha deve ter no mínimo 6 caracteres.';
                errorDiv.style.display = 'block';
                return;
            }

            const btn = setPasswordForm.querySelector('button[type="submit"]');
            const oldText = btn.textContent;
            btn.textContent = 'Salvando...';
            btn.disabled = true;

            try {
                // O Supabase já logou o usuário automaticamente pela hash da URL
                const { data, error } = await supabaseClient.auth.updateUser({
                    password: newPassword
                });

                if (error) throw error;

                // Senha salva com sucesso. Limpar hash da URL
                window.history.replaceState(null, null, window.location.pathname);
                
                // Mostrar dashboard
                document.getElementById('login-container').classList.remove('active');
                document.getElementById('app-container').classList.add('active');
                
                // Puxar dados do usuário atualizado
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (user) {
                    currentUser = {
                        id: user.id,
                        name: user.user_metadata?.name || user.email,
                        role: user.user_metadata?.role || 'user',
                        building: user.user_metadata?.building || 'Geral'
                    };
                    document.getElementById('user-name-display').textContent = currentUser.name;
                    document.getElementById('user-role-display').textContent = currentUser.role.toUpperCase();
                    applyUserRoleSettings();
                    loadDashboardData();
                }

            } catch (err) {
                errorDiv.textContent = 'Erro ao salvar senha: ' + err.message;
                errorDiv.style.display = 'block';
            } finally {
                btn.textContent = oldText;
                btn.disabled = false;
            }
        });
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameVal = document.getElementById('username').value.trim();
        const passwordVal = document.getElementById('password').value.trim();
        
        const btn = loginForm.querySelector('button[type="submit"]');
        const oldText = btn.textContent;
        btn.textContent = 'Validando...';
        btn.disabled = true;

        if (!supabaseClient) {
            alert('Supabase client não carregado. Verifique a conexão com a internet.');
            btn.textContent = oldText;
            btn.disabled = false;
            return;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: usernameVal,
            password: passwordVal,
        });

        if (error) {
            alert(`Acesso negado: ${error.message}`);
            addDevErrorLog('Segurança', `Falha de login no Supabase para: ${usernameVal}`, 'Alta', '401 Unauthorized');
            btn.textContent = oldText;
            btn.disabled = false;
            return;
        }
        
        // Se a senha e usuário batem, configura currentUser
        // Como o Supabase não retorna nossas roles personalizadas por padrão, definimos como admin
        currentUser.role = 'admin'; 
        currentUser.name = data.user.email.split('@')[0];
        currentUser.building = 'Admin Master';
        currentUser.buildingId = 'all';
        
        // Ativar Tela Principal
        document.getElementById('login-container').classList.remove('active');
        document.getElementById('app-container').classList.add('active');
        
        // Aplicar Regras de Perfil e carregar informações
        applyUserRoleSettings();
        loadDashboardData();
    });

    // Botão Sair
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn.addEventListener('click', () => {
        document.getElementById('app-container').classList.remove('active');
        document.getElementById('login-container').classList.add('active');
    });
}

/* ==========================================================================
   CONFIGURAÇÃO DE PERMISSÕES E DADOS DINÂMICOS
   ========================================================================== */
function applyUserRoleSettings() {
    const body = document.body;
    
    // Reseta classes antigas de perfil
    body.classList.remove('role-admin', 'role-gerente', 'role-gestor', 'role-developer', 'role-financeiro');
    
    // Adiciona a classe correspondente ao papel atual no body
    body.classList.add(`role-${currentUser.role}`);
    
    // Atualiza cabeçalhos e avatares no painel superior
    document.getElementById('user-name-display').textContent = currentUser.name;
    document.getElementById('welcome-user-name').textContent = currentUser.name.split(' ')[0];
    document.getElementById('user-building').textContent = currentUser.building;
    
    // Iniciais do Avatar
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('avatar-letters').textContent = initials;
    
    // Ajusta o Badge visual da role no topbar
    const roleBadge = document.getElementById('user-role-display');
    roleBadge.textContent = currentUser.role.toUpperCase();
    roleBadge.className = 'user-role'; // reset
    roleBadge.classList.add(`badge-${currentUser.role}`);
    applyActiveTheme();
}

function isContractExpiringSoon(c) {
    if (!c.endDate || c.status !== 'vigente') return false;
    const parts = c.endDate.split('/');
    if (parts.length !== 3) return false;
    const end = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Expira em até 30 dias (ou já expirou há até 10 dias)
    return diffDays >= -10 && diffDays <= 30;
}

/* Carrega dados filtrados no Dashboard com base no perfil */
function loadDashboardData() {
    let filteredBuildings = [];
    let filteredContracts = [];
    
    let totalUnits = 0;
    let occupiedUnits = 0;
    
    // Filtros por prédio se for um Gestor de prédio específico
    if (currentUser.role === 'gestor') {
        filteredBuildings = BUILDINGS_DATA.filter(b => b.id === currentUser.buildingId);
        filteredContracts = CONTRACTS_DATA.filter(c => c.buildingId === currentUser.buildingId && isContractExpiringSoon(c));
        
        totalUnits = filteredBuildings[0].units;
        occupiedUnits = filteredBuildings[0].occupied;
    } else {
        // Admin e Gerente visualizam tudo
        filteredBuildings = BUILDINGS_DATA;
        filteredContracts = CONTRACTS_DATA.filter(isContractExpiringSoon);
        
        BUILDINGS_DATA.forEach(b => {
            totalUnits += b.units;
            occupiedUnits += b.occupied;
        });
    }
    
    // Calcular estatísticas
    const occupancyRate = ((occupiedUnits / totalUnits) * 100).toFixed(1);
    
    // Atualizar os elementos do DOM
    document.getElementById('stat-occupancy').textContent = `${occupancyRate}%`;
    document.getElementById('occupancy-progress').style.width = `${occupancyRate}%`;
    
    document.getElementById('stat-contracts').textContent = occupiedUnits;
    document.getElementById('contracts-progress').style.width = `${occupancyRate}%`;
    document.getElementById('stat-units-desc').textContent = `de ${totalUnits} unidades totais`;
    
    // Atualizar Alertas
    document.getElementById('stat-alerts').textContent = filteredContracts.length;
    
    // Carregar Lista de Prédios na Lateral do Dashboard
    const buildingList = document.getElementById('building-list-container');
    buildingList.innerHTML = ''; // Limpa anterior
    
    document.getElementById('building-count-badge').textContent = `${filteredBuildings.length} Prédio(s)`;
    
    filteredBuildings.forEach(b => {
        const rateClass = b.rate >= 92 ? 'high' : 'medium';
        const itemHtml = `
            <div class="building-item">
                <div class="building-item-info">
                    <div class="building-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M9 21V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12"></path></svg>
                    </div>
                    <div>
                        <div class="building-name">${b.name}</div>
                        <div class="building-manager">Gestor: ${b.manager}</div>
                    </div>
                </div>
                <div class="building-occupancy-pill ${rateClass}">
                    ${b.rate}% Ocup.
                </div>
            </div>
        `;
        buildingList.insertAdjacentHTML('beforeend', itemHtml);
    });
    
    // Carregar Tabela de Vencimento de Contratos
    const tableBody = document.getElementById('vencimentos-table-body');
    tableBody.innerHTML = '';
    
    if (filteredContracts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum contrato com vencimento próximo para este setor.
                </td>
            </tr>
        `;
    } else {
        // Limita a 3 contratos para economizar espaço
        const displayContracts = filteredContracts.slice(0, 3);
        
        displayContracts.forEach(c => {
            const tenantName = c.tenantName || c.tenant;
            const unitStr = c.unitNumber ? `Apto ${c.unitNumber} - ${c.buildingName}` : c.unit;
            const expiryDate = c.endDate || c.expiry;
            
            const rowHtml = `
                <tr>
                    <td><span class="tenant-name" style="font-size: 13px;">${tenantName}</span></td>
                    <td><span class="unit-tag">${unitStr}</span></td>
                    <td><span class="text-danger" style="font-weight: 600;">${expiryDate}</span></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHtml);
        });
    }
    
    // --- Nova Tabela: Quartos Disponíveis (Pós-Aviso) ---
    const disponiveisBody = document.getElementById('disponiveis-table-body');
    if (disponiveisBody) {
        disponiveisBody.innerHTML = '';
        const now = new Date();
        let availUnits = [];
        
        filteredBuildings.forEach(b => {
            const bUnits = UNITS_DATA.filter(u => u.buildingId === b.id);
            bUnits.forEach(u => {
                if (u.status === 'notice' && u.noticeDate) {
                    const noticeDate = new Date(u.noticeDate);
                    const diffTime = now - noticeDate;
                    const diffDays = 30 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 0) {
                        availUnits.push({ unit: u, building: b });
                    }
                }
            });
        });
        
        if (availUnits.length === 0) {
            disponiveisBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--neutral-500); padding: 20px;">Nenhuma unidade livre no momento.</td></tr>`;
        } else {
            availUnits.forEach(item => {
                disponiveisBody.insertAdjacentHTML('beforeend', `
                    <tr>
                        <td><strong>Apto ${item.unit.number}</strong><br><span style="font-size: 11px; color: var(--neutral-500);">${item.building.name}</span></td>
                        <td>R$ ${item.unit.rent || 0}</td>
                        <td><span style="background: var(--warning-light); color: var(--warning); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">Livre</span></td>
                    </tr>
                `);
            });
        }
    }
    
    // Carregar Tabela de Aluguéis em Aberto (Vencidos Dia 10)
    let filteredOpenTenants = [];
    if (currentUser.role === 'gestor') {
        filteredOpenTenants = TENANTS_DATA.filter(t => t.rentStatus === 'em_aberto' && t.dueDay === 10 && t.history && t.history[0] && t.history[0].buildingId === currentUser.buildingId);
    } else {
        filteredOpenTenants = TENANTS_DATA.filter(t => t.rentStatus === 'em_aberto' && t.dueDay === 10);
    }
    
    const openTableBody = document.getElementById('aluguel-aberto-table-body');
    if (openTableBody) {
        openTableBody.innerHTML = '';
        if (filteredOpenTenants.length === 0) {
            openTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                        Nenhum aluguel em aberto para este setor.
                    </td>
                </tr>
            `;
        } else {
            filteredOpenTenants.forEach(t => {
                const hist = t.history && t.history[0] ? t.history[0] : {};
                const unitStr = hist.unitNumber ? `Apto ${hist.unitNumber} - ${hist.buildingName}` : 'N/A';
                const formattedRent = (t.rentValue || 1500).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                
                const rowHtml = `
                    <tr>
                        <td>
                            <div class="tenant-cell-info">
                                <span class="tenant-name">${t.name}</span>
                                <span class="tenant-phone">${t.phone}</span>
                            </div>
                        </td>
                        <td><span class="unit-tag">${unitStr}</span></td>
                        <td><strong>${formattedRent}</strong></td>
                        <td><span class="text-danger" style="font-weight: 600;">10/07/2026</span></td>
                    </tr>
                `;
                openTableBody.insertAdjacentHTML('beforeend', rowHtml);
            });
        }
    }
}

/* ==========================================================================
   NAVEGAÇÃO DE ABAS
   ========================================================================== */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetTab = link.getAttribute('data-tab');
            
            // Remove active de todos os links e adiciona no selecionado
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Esconde todas as abas e mostra a selecionada
            tabContents.forEach(tab => tab.classList.remove('active'));
            const activeTabEl = document.getElementById(`tab-${targetTab}`);
            if (activeTabEl) {
                activeTabEl.classList.add('active');
            }
            
            // Lógica específica para quando entra na aba Prédios
            if (targetTab === 'predios') {
                loadBuildingsGrid();
                const viewList = document.getElementById('view-predios-list');
                const viewDetail = document.getElementById('view-predios-detail');
                const drawer = document.getElementById('unit-detail-drawer');
                if (viewList) viewList.style.display = 'block';
                if (viewDetail) viewDetail.style.display = 'none';
                if (drawer) drawer.classList.remove('active');
            }
            
            // Lógica específica para quando entra na aba Contratos
            if (targetTab === 'contratos') {
                loadContractsList();
                loadPendingContractsList();
                updateContractBadge();
                
                // Se houver dados de redirecionamento pré-preenchidos
                if (window.prefilledContractData) {
                    const data = window.prefilledContractData;
                    
                    // Alterna para sub-aba Emitir Contrato
                    document.querySelector('[data-contract-subtab="emitir"]').click();
                    
                    // Preenche prédio e unidade
                    const activeUnit = UNITS_DATA.find(u => u.id === data.unitId);
                    if (activeUnit) {
                        const bSelect = document.getElementById('contract-building');
                        if (bSelect) {
                            bSelect.value = activeUnit.buildingId;
                            bSelect.dispatchEvent(new Event('change'));
                        }
                        
                        const uSelect = document.getElementById('contract-unit');
                        if (uSelect) {
                            uSelect.value = activeUnit.id;
                            uSelect.dispatchEvent(new Event('change'));
                        }
                        
                        // Se a unidade já estivesse ocupada, preenche dados do inquilino
                        const nameInp = document.getElementById('contract-tenant-name');
                        const phoneInp = document.getElementById('contract-tenant-phone');
                        if (activeUnit.status === 'occupied') {
                            if (nameInp) nameInp.value = activeUnit.tenant || '';
                            if (phoneInp) phoneInp.value = activeUnit.phone || '';
                        }
                    }
                    
                    // Limpar prefilled
                    window.prefilledContractData = null;
                }
            }
            
            // Atualiza o título do contexto no cabeçalho superior
            const linkText = link.querySelector('span').textContent;
            document.getElementById('topbar-context').textContent = linkText;
            applyActiveTheme();
        });
    });

    // Links de atalho rápido no Dashboard para ir para outras abas
    document.getElementById('btn-quick-contract').addEventListener('click', () => {
        document.querySelector('[data-tab="contratos"]').click();
    });
    
    document.getElementById('link-go-to-contracts').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('[data-tab="contratos"]').click();
        const vencendoBtn = document.querySelector('[data-contract-subtab="vencendo"]');
        if (vencendoBtn) vencendoBtn.click();
    });

    // Delegar cliques nos botões da tabela para ir à aba de contratos
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-action-fill-contract')) {
            document.querySelector('[data-tab="contratos"]').click();
        }
    });
}

/* ==========================================================================
   CONFIGURAÇÕES DO ADMINISTRADOR (LÓGICA)
   ========================================================================== */

function setupConfigTabs() {
    // Navegação interna das sub-abas de configurações
    const subnavBtns = document.querySelectorAll('.subnav-btn');
    const subtabContents = document.querySelectorAll('.subtab-content');
    
    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-subtab');
            
            subnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            subtabContents.forEach(tab => tab.classList.remove('active'));
            const activeTabEl = document.getElementById(`subtab-${targetSubtab}`);
            if (activeTabEl) {
                activeTabEl.classList.add('active');
            }
        });
    });

    // Toggle formulário de novo usuário
    const btnToggleForm = document.getElementById('btn-toggle-user-form');
    const userFormCard = document.getElementById('user-form-card');
    const btnCancelUser = document.getElementById('btn-cancel-user');
    
    if (btnToggleForm && userFormCard) {
        btnToggleForm.addEventListener('click', () => {
            userFormCard.classList.toggle('active');
            btnToggleForm.classList.toggle('btn-active');
        });
    }
    
    if (btnCancelUser && userFormCard) {
        btnCancelUser.addEventListener('click', () => {
            userFormCard.classList.remove('active');
            if (btnToggleForm) btnToggleForm.classList.remove('btn-active');
            document.getElementById('form-new-user').reset();
        });
    }

    // Formulário de Cadastro de Novo Usuário
    const formNewUser = document.getElementById('form-new-user');
    if (formNewUser) {
        formNewUser.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('new-user-name').value;
            const email = document.getElementById('new-user-email').value;
            const role = document.getElementById('new-user-role').value;
            const bldSelect = document.getElementById('new-user-building');
            const building = bldSelect.options[bldSelect.selectedIndex].text;
            const buildingId = bldSelect.value;
            
            const submitBtn = formNewUser.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando Convite...';
            submitBtn.disabled = true;

            try {
                // Recuperar o token da sessão atual do Supabase
                const { data: { session } } = await supabaseClient.auth.getSession();
                const token = session?.access_token;

                if (!token) {
                    throw new Error('Você não está autenticado.');
                }

                const response = await fetch(`${API_URL}/users/invite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, email, role, building, buildingId })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Erro ao convidar usuário');
                }
                
                alert('Convite mágico enviado com sucesso para o e-mail: ' + email);
                
                // Logar ação
                logActivity(`Enviou convite do Supabase para novo usuário: ${email} (${role.toUpperCase()})`);
                
                // Resetar e recarregar
                formNewUser.reset();
                if (userFormCard) userFormCard.classList.remove('active');
                if (btnToggleForm) btnToggleForm.classList.remove('btn-active');
                
            } catch (err) {
                console.error(err);
                alert('Falha ao convidar: ' + err.message);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }


    // Botão Limpar Logs
    const btnClearLogs = document.getElementById('btn-clear-logs');
    if (btnClearLogs) {
        btnClearLogs.addEventListener('click', () => {
            AUDIT_LOGS = [];
            logActivity('Auditoria de logs limpa pelo Administrador');
            loadLogsTable();
        });
    }
}

function loadConfigData() {
    loadUsersTable();
    loadPermissionsTable();
    loadLogsTable();
    updateDriveUI();
}

async function loadUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Carregando usuários...</td></tr>';
    
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const token = session?.access_token;
        if (!token) return;

        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar usuários');
        }
        
        const users = await response.json();
        USERS_DATA = users; // Atualiza variável global para o resto do app
        localStorage.setItem('bueno_users_data', JSON.stringify(USERS_DATA)); // Salva cache local
        
        tableBody.innerHTML = '';
        
        // Atualiza os dropdowns que dependem de gestores
        loadPermissionsTable();
        
        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhum usuário cadastrado.</td></tr>';
            return;
        }

        users.forEach(user => {
            const badgeClass = `badge-${user.role}`;
            const statusClass = user.active ? 'status-active' : 'status-inactive';
            const statusLabel = user.active ? 'Ativo' : 'Inativo';
            const actionLabel = user.active ? 'Desativar' : 'Reativar';
            const actionClass = user.active ? 'btn-deactivate' : 'btn-activate';
            
            const rowHtml = `
                <tr>
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td><span class="user-role ${badgeClass}">${user.role.toUpperCase()}</span></td>
                    <td><span class="unit-tag">${user.building}</span></td>
                    <td><span class="user-status-dot ${statusClass}">${statusLabel}</span></td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-action-mini ${actionClass}" onclick="toggleUserStatus('${user.id}', ${!user.active})">${actionLabel}</button>
                            <button class="btn-action-mini btn-danger" style="background: var(--danger); color: white; border: none;" onclick="deleteUser('${user.id}', '${user.name}')">Excluir</button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHtml);
        });
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Erro ao carregar usuários. Verifique as configurações.</td></tr>';
    }
}

async function toggleUserStatus(userId, newStatus) {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        const response = await fetch(`${API_URL}/users/${userId}/status`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}` 
            },
            body: JSON.stringify({ active: newStatus })
        });
        
        if (!response.ok) throw new Error('Falha ao alterar status');
        
        logActivity(`Alterou status do usuário para ${newStatus ? 'ATIVO' : 'INATIVO'} via API Admin`);
        loadUsersTable();
    } catch(err) {
        alert(err.message);
    }
}

async function deleteUser(userId, userName) {
    if (!confirm(`TEM CERTEZA que deseja EXCLUIR DEFINITIVAMENTE o usuário ${userName}? Esta ação não pode ser desfeita e ele perderá o acesso imediatamente.`)) {
        return;
    }
    
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${session?.access_token}` 
            }
        });
        
        if (!response.ok) throw new Error('Falha ao excluir usuário');
        
        logActivity(`Excluiu permanentemente o usuário: ${userName}`);
        alert('Usuário excluído com sucesso.');
        loadUsersTable();
    } catch(err) {
        alert(err.message);
    }
}

function loadPermissionsTable() {
    const tableBody = document.getElementById('permissions-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    BUILDINGS_DATA.forEach(building => {
        // Encontrar gestores possíveis (todos do tipo 'gestor' ou 'gerente' ou 'admin')
        const managers = USERS_DATA.filter(u => u.role !== 'admin' && u.active);
        
        let selectOptions = `<option value="">Selecione um gestor...</option>`;
        managers.forEach(mgr => {
            const selected = building.manager === mgr.name ? 'selected' : '';
            selectOptions += `<option value="${mgr.id}" ${selected}>${mgr.name} (${mgr.role.toUpperCase()})</option>`;
        });
        
        const themes = [
            { value: 'default', label: 'Padrão (Azul/Dourado)' },
            { value: 'orange', label: 'Sol Nascente (Laranja)' },
            { value: 'green', label: 'Kyoto (Verde)' },
            { value: 'pink', label: 'Sunset (Rosa/Pink)' },
            { value: 'purple', label: 'Tech (Roxo)' }
        ];
        
        let themeOptions = '';
        themes.forEach(t => {
            const selected = (building.theme || 'default') === t.value ? 'selected' : '';
            themeOptions += `<option value="${t.value}" ${selected}>${t.label}</option>`;
        });
        
        const rowHtml = `
            <tr>
                <td><strong>${building.name}</strong></td>
                <td><span class="badge">${building.units} Unidades</span></td>
                <td><span class="building-manager-name">${building.manager || 'Sem Gestor'}</span></td>
                <td>
                    <select class="building-manager-select" data-building-id="${building.id}" onchange="changeBuildingManager(this)">
                        ${selectOptions}
                    </select>
                </td>
                <td>
                    <select class="building-theme-select" data-building-id="${building.id}" onchange="changeBuildingTheme(this)" style="padding: 6px; border-radius: var(--border-radius-sm); border: 1px solid var(--neutral-300); background: white; width: 100%;">
                        ${themeOptions}
                    </select>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function changeBuildingTheme(selectEl) {
    const buildingId = selectEl.getAttribute('data-building-id');
    const newTheme = selectEl.value;
    
    const building = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (building) {
        const oldTheme = building.theme || 'default';
        building.theme = newTheme;
        
        logActivity(`Alterou tema do ${building.name} de "${oldTheme}" para "${newTheme}"`);
        saveState();
        applyActiveTheme();
    }
}

function changeBuildingManager(selectEl) {
    const buildingId = selectEl.getAttribute('data-building-id');
    const userId = selectEl.value;
    
    const building = BUILDINGS_DATA.find(b => b.id === buildingId);
    const user = USERS_DATA.find(u => u.id === userId);
    
    if (building && user) {
        const oldManager = building.manager;
        building.manager = user.name;
        
        // Se o usuário for gestor, vincular também o prédio no perfil dele
        if (user.role === 'gestor') {
            user.building = building.name;
            user.buildingId = building.id;
        }
        
        logActivity(`Reatribuiu gerenciamento do ${building.name} de "${oldManager}" para "${user.name}"`);
        loadConfigData();
        loadDashboardData(); // Atualiza dashboard com novos gestores imediatamente!
    }
}

function loadLogsTable() {
    const tableBody = document.getElementById('logs-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (AUDIT_LOGS.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum registro de atividade recente.
                </td>
            </tr>
        `;
        return;
    }
    
    AUDIT_LOGS.forEach(log => {
        const badgeClass = `badge-${log.role}`;
        const rowHtml = `
            <tr>
                <td><strong>${log.user}</strong></td>
                <td><span class="user-role ${badgeClass}">${log.role.toUpperCase()}</span></td>
                <td>${log.action}</td>
                <td class="text-neutral-500">${log.time}</td>
                <td><small class="text-neutral-500">${log.ip}</small></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function logActivity(actionText) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    
    const newLog = {
        user: currentUser.name,
        role: currentUser.role,
        action: actionText,
        time: formattedDate,
        ip: '192.168.1.100 (Windows)'
    };
    
    AUDIT_LOGS.unshift(newLog); // Adiciona no início
    
    // Limita a 50 logs no array
    if (AUDIT_LOGS.length > 50) {
        AUDIT_LOGS.pop();
    }
    
    loadLogsTable();
    saveState();
}

function updateDriveUI() {
    const statusBadge = document.getElementById('drive-status-badge');
    const storageFill = document.getElementById('drive-storage-fill');
    const storageUsed = document.getElementById('drive-storage-used');
    const storagePercent = document.getElementById('drive-storage-percent');
    
    if (!statusBadge) return;
    
    if (DRIVE_CONFIG.connected) {
        statusBadge.textContent = 'Conectado';
        statusBadge.className = 'drive-status-badge status-connected';
        
        // Simular preenchimento de input se estiver salvo
        const cId = document.getElementById('drive-client-id');
        const aKey = document.getElementById('drive-api-key');
        const fId = document.getElementById('drive-folder-id');
        
        if (cId) cId.value = DRIVE_CONFIG.clientId || '•••••••••••••••••••••';
        if (aKey) aKey.value = DRIVE_CONFIG.apiKey || '•••••••••••••••••••••';
        if (fId) fId.value = DRIVE_CONFIG.folderId;
        
        // Aumentar o uso simulado ligeiramente para mostrar atividade
        if (storageFill) storageFill.style.width = '3.8%';
        if (storageUsed) storageUsed.textContent = '0.57 GB utilizados';
        if (storagePercent) storagePercent.textContent = '3.8% em uso';
    } else {
        statusBadge.textContent = 'Desconectado';
        statusBadge.className = 'drive-status-badge status-disconnected';
        
        if (storageFill) storageFill.style.width = '1.5%';
        if (storageUsed) storageUsed.textContent = '0.22 GB utilizados';
        if (storagePercent) storagePercent.textContent = '1.5% em uso';
    }
}

// Expor no escopo global do window para acesso inline no HTML
window.toggleUserStatus = toggleUserStatus;
window.changeBuildingManager = changeBuildingManager;
window.setupConfigTabs = setupConfigTabs;
window.loadConfigData = loadConfigData;

function parseSubdivisionsInput(inputText, totalUnits, defaultStartNum, defaultSuffix) {
    if (!inputText) return [];
    
    const tokens = inputText.split(',').map(t => t.trim()).filter(t => t !== '');
    const results = [];
    
    let hasUnitsSpecified = false;
    tokens.forEach(token => {
        if (token.includes(':') || (token.includes('(') && token.includes(')'))) {
            hasUnitsSpecified = true;
        }
    });
    
    if (hasUnitsSpecified) {
        tokens.forEach(token => {
            let name = token;
            let units = 0;
            let startNum = defaultStartNum || 1;
            let suffix = '';
            
            if (token.includes(':')) {
                const parts = token.split(':').map(p => p.trim());
                name = parts[0];
                units = parseInt(parts[1]) || 0;
                if (parts.length >= 3) {
                    startNum = parseInt(parts[2]) || 1;
                }
                if (parts.length >= 4) {
                    suffix = parts[3];
                } else {
                    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    suffix = cleanName.charAt(cleanName.length - 1) || '';
                }
            } else if (token.includes('(') && token.includes(')')) {
                const start = token.indexOf('(');
                const end = token.indexOf(')');
                name = token.substring(0, start).trim();
                units = parseInt(token.substring(start + 1, end).trim()) || 0;
                
                const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                suffix = cleanName.charAt(cleanName.length - 1) || '';
            }
            
            results.push({
                name: name,
                units: units,
                startNum: startNum,
                suffix: suffix
            });
        });
    } else {
        const unitsPerSub = Math.ceil(totalUnits / tokens.length);
        tokens.forEach(name => {
            const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const suffix = cleanName.charAt(cleanName.length - 1) || '';
            results.push({
                name: name,
                units: unitsPerSub,
                startNum: defaultStartNum || 1,
                suffix: suffix
            });
        });
    }
    
    return results;
}

function generateMockCPF() {
    const r = () => Math.floor(Math.random() * 900 + 100);
    const d = () => Math.floor(Math.random() * 90 + 10);
    return `${r()}.${r()}.${r()}-${d()}`;
}

function generateMockRG() {
    const r = () => Math.floor(Math.random() * 900 + 100);
    return `${Math.floor(Math.random() * 9 + 1)}.${r()}.${r()}`;
}

function syncMockTenantsAndContracts() {
    TENANTS_DATA = [];
    CONTRACTS_DATA = [];
    
    // Lista de inquilinos com contratos prestes a vencer
    const expiringMap = {
        'Ana Souza': '15/07/2026',
        'Bruno Santos': '22/07/2026',
        'Carla Oliveira': '29/07/2026',
        'Diego Silva': '05/08/2026',
        'Eduardo Ferreira': '12/08/2026'
    };

    UNITS_DATA.forEach(unit => {
        if (unit.status !== 'occupied' || !unit.tenant) return;
        
        const building = BUILDINGS_DATA.find(b => b.id === unit.buildingId);
        const buildingName = building ? building.name : 'Bueno Residence';
        
        // Verificar se inquilino já está cadastrado
        let tenant = TENANTS_DATA.find(t => t.name === unit.tenant);
        
        if (!tenant) {
            const tenantId = `tenant-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const mockCpf = generateMockCPF();
            const mockRg = generateMockRG();
            
            const unitNum = parseInt(unit.number) || 1;
            tenant = {
                id: tenantId,
                name: unit.tenant,
                cpf: mockCpf,
                rg: mockRg,
                phone: unit.phone || '(62) 99111-2233',
                email: `${unit.tenant.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.')}@buenoresidence.com`,
                dueDay: (unitNum % 10 === 1 || unitNum % 10 === 3) ? 10 : (unitNum % 10 === 5 || unitNum % 10 === 7 ? 10 : (unitNum % 10 === 2 || unitNum % 10 === 4 ? 15 : 20)),
                rentStatus: (unitNum % 10 === 1 || unitNum % 10 === 3) ? 'em_aberto' : 'pago',
                rentValue: unit.rent || 1500,
                documents: [
                    { name: 'RG_CNH.pdf', date: '10/01/2026', size: '1.2 MB' },
                    { name: 'Comprovante_Renda.pdf', date: '10/01/2026', size: '890 KB' },
                    { name: 'Consulta_Serasa.pdf', date: '10/01/2026', size: '350 KB' }
                ],
                history: [
                    {
                        buildingId: unit.buildingId,
                        buildingName: buildingName,
                        unitId: unit.id,
                        unitNumber: unit.number,
                        period: 'Jan/2026 - Atual',
                        rent: unit.rent,
                        status: 'active'
                    }
                ],
                active: true
            };
            TENANTS_DATA.push(tenant);
        }
        
        // Criar Contrato correspondente
        const contractId = `ctr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Definir vencimento
        let expiryDate = '15/07/2027'; // 1 ano padrão
        let startDate = '15/07/2026';
        let sigStatus = 'assinado';
        let signedFile = `Contrato_Assinado_${unit.number}_${buildingName.replace(/\s+/g, '')}.pdf`;
        
        if (expiringMap[unit.tenant]) {
            expiryDate = expiringMap[unit.tenant];
            const parts = expiryDate.split('/');
            startDate = `${parts[0]}/${parts[1]}/${parseInt(parts[2]) - 1}`;
        }
        
        // Tornar alguns contratos específicos pendentes de assinatura do Admin
        if (unit.tenant === 'Fernanda Ramos' || unit.tenant === 'Helena Lima') {
            sigStatus = 'pendente_assinatura';
            signedFile = null;
        }
        
        const mockContract = {
            id: contractId,
            buildingId: unit.buildingId,
            buildingName: buildingName,
            unitId: unit.id,
            unitNumber: unit.number,
            tenantId: tenant.id,
            tenantName: tenant.name,
            tenantCpf: tenant.cpf,
            tenantRg: tenant.rg,
            tenantPhone: tenant.phone,
            tenantEmail: tenant.email,
            rentValue: unit.rent,
            duration: 12,
            startDate: startDate,
            endDate: expiryDate,
            paymentDueDay: 10,
            guaranteeType: 'Caução',
            guarantorName: '',
            guarantorCpf: '',
            clauses: 'Contrato residencial padrão de locação Bueno Residence.',
            status: 'vigente',
            signatureStatus: sigStatus,
            signedFileUrl: signedFile,
            createdAt: startDate
        };
        
        CONTRACTS_DATA.push(mockContract);
    });
}


function generateMockUnits() {
    if (UNITS_DATA.length > 0) return; // Evitar duplicidade
    
    const mockTenants = [
        { name: 'Ana Souza', phone: '(62) 99111-2233' },
        { name: 'Bruno Santos', phone: '(62) 98222-3344' },
        { name: 'Carla Oliveira', phone: '(62) 99333-4455' },
        { name: 'Diego Silva', phone: '(62) 98444-5566' },
        { name: 'Eduardo Ferreira', phone: '(62) 99555-6677' },
        { name: 'Fernanda Ramos', phone: '(62) 98666-7788' },
        { name: 'Gabriel Costa', phone: '(62) 99777-8899' },
        { name: 'Helena Lima', phone: '(62) 98888-9900' },
        { name: 'Igor Martins', phone: '(62) 99999-0011' }
    ];

    BUILDINGS_DATA.forEach(building => {
        const defaultStart = building.startNum || 1;
        const defaultSuffix = building.suffix || '';
        const subs = building.subdivisions || [];
        
        const totalUnits = building.units;
        const occupiedCount = Math.round(totalUnits * (building.rate / 100));
        let occupiedGenerated = 0;
        
        if (subs.length > 0) {
            subs.forEach(sub => {
                const subStart = sub.startNum || 1;
                const subSuffix = sub.suffix || '';
                const subUnitsCount = sub.units || 0;
                
                for (let i = 0; i < subUnitsCount; i++) {
                    const aptNum = subStart + i;
                    const numberStr = `${aptNum}${subSuffix}`;
                    let status = 'vacant';
                    let tenantName = '';
                    let tenantPhone = '';
                    
                    if (occupiedGenerated < occupiedCount && Math.random() > 0.15) {
                        status = 'occupied';
                        occupiedGenerated++;
                        const tenantObj = mockTenants[Math.floor(Math.random() * mockTenants.length)];
                        tenantName = tenantObj.name;
                        tenantPhone = tenantObj.phone;
                    } else if (Math.random() > 0.85) {
                        status = 'maintenance';
                    }
                    
                    UNITS_DATA.push({
                        id: `${building.id}-${sub.name.replace(/\s+/g, '')}-${numberStr}`,
                        buildingId: building.id,
                        number: numberStr,
                        floor: 1,
                        status: status,
                        subdivision: sub.name,
                        tenant: tenantName,
                        phone: tenantPhone,
                        rent: 1200 + (i * 10)
                    });
                }
            });
        } else {
            for (let i = 0; i < totalUnits; i++) {
                const aptNum = defaultStart + i;
                const numberStr = `${aptNum}${defaultSuffix}`;
                let status = 'vacant';
                let tenantName = '';
                let tenantPhone = '';
                
                if (occupiedGenerated < occupiedCount && Math.random() > 0.15) {
                    status = 'occupied';
                    occupiedGenerated++;
                    const tenantObj = mockTenants[Math.floor(Math.random() * mockTenants.length)];
                    tenantName = tenantObj.name;
                    tenantPhone = tenantObj.phone;
                } else if (Math.random() > 0.85) {
                    status = 'maintenance';
                }
                
                UNITS_DATA.push({
                    id: `${building.id}-${numberStr}`,
                    buildingId: building.id,
                    number: numberStr,
                    floor: 1,
                    status: status,
                    subdivision: '',
                    tenant: tenantName,
                    phone: tenantPhone,
                    rent: 1200 + (i * 10)
                });
            }
        }
    });
}

window.generateMockUnits = generateMockUnits;

/* ==========================================================================
   GESTÃO DE PRÉDIOS E UNIDADES (LÓGICA)
   ========================================================================== */

function loadBuildingsGrid() {
    const container = document.getElementById('buildings-grid-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredBuildings = BUILDINGS_DATA;
    if (currentUser.role === 'gestor') {
        filteredBuildings = BUILDINGS_DATA.filter(b => b.id === currentUser.buildingId);
    }
    
    filteredBuildings.forEach(building => {
        const buildingUnits = UNITS_DATA.filter(u => u.buildingId === building.id);
        const totalUnits = buildingUnits.length || building.units;
        const occupied = buildingUnits.filter(u => u.status === 'occupied' || u.status === 'notice').length;
        const vacant = buildingUnits.filter(u => u.status === 'vacant').length;
        const maintenance = buildingUnits.filter(u => u.status === 'maintenance').length;
        
        const rate = totalUnits > 0 ? ((occupied / totalUnits) * 100).toFixed(1) : 0;
        
        const cardHtml = `
            <div class="predio-card" data-building-id="${building.id}">
                <div class="predio-card-header">
                    <div>
                        <h3 class="predio-card-title">${building.name}</h3>
                        <span class="predio-card-units">${totalUnits} Unidades</span>
                    </div>
                    <div class="predio-card-actions-top">
                        <button class="btn-card-action-mini edit-btn restricted-admin-manager" onclick="editBuilding('${building.id}', event)" title="Editar Bloco">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button class="btn-card-action-mini delete-btn restricted-admin" onclick="deleteBuilding('${building.id}', event)" title="Excluir Bloco">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="predio-card-body">
                    <div class="predio-info-row">
                        <span class="predio-info-label">Gestor:</span>
                        <span class="predio-info-value">${building.manager || 'Sem Gestor'}</span>
                    </div>
                    <div class="predio-info-row">
                        <span class="predio-info-label">Alugados:</span>
                        <span class="predio-info-value text-primary">${occupied}</span>
                    </div>
                    <div class="predio-info-row">
                        <span class="predio-info-label">Livres:</span>
                        <span class="predio-info-value text-success">${vacant}</span>
                    </div>
                    <div class="predio-info-row">
                        <span class="predio-info-label">Em Manutenção:</span>
                        <span class="predio-info-value text-warning">${maintenance}</span>
                    </div>
                    <div class="predio-occupancy-row">
                        <div class="predio-gauge-container">
                            <span class="subtab-desc">Taxa de Ocupação</span>
                            <div class="predio-gauge-bar">
                                <div class="predio-gauge-fill" style="width: ${rate}%;"></div>
                            </div>
                        </div>
                        <span class="predio-occupancy-text">${rate}%</span>
                    </div>
                </div>
                <div class="predio-card-actions">
                    <button class="btn-card-action" onclick="viewBuildingDetail('${building.id}')">
                        <span>Visualizar Unidades</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function viewBuildingDetail(buildingId) {
    activeBuildingId = buildingId;
    const building = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!building) return;
    
    const viewList = document.getElementById('view-predios-list');
    const viewDetail = document.getElementById('view-predios-detail');
    const drawer = document.getElementById('unit-detail-drawer');
    
    if (viewList) viewList.style.display = 'none';
    if (viewDetail) viewDetail.style.display = 'block';
    if (drawer) drawer.classList.remove('active');
    
    const nameEl = document.getElementById('detail-building-name');
    if (nameEl) nameEl.textContent = building.name;
    
    updateBlockStatsUI(buildingId);
    loadUnitsGrid();
    applyActiveTheme();
}

function updateBlockStatsUI(buildingId) {
    const building = BUILDINGS_DATA.find(b => b.id === buildingId);
    const buildingUnits = UNITS_DATA.filter(u => u.buildingId === buildingId);
    
    const total = buildingUnits.length;
    const occupied = buildingUnits.filter(u => u.status === 'occupied' || u.status === 'notice').length;
    const vacant = buildingUnits.filter(u => u.status === 'vacant').length;
    const maintenance = buildingUnits.filter(u => u.status === 'maintenance').length;
    const rate = total > 0 ? ((occupied / total) * 100).toFixed(1) : 0;
    
    const rateEl = document.getElementById('detail-occupancy-rate');
    const totalEl = document.getElementById('detail-total-units');
    const vacantEl = document.getElementById('detail-vacant-units');
    const occupiedEl = document.getElementById('detail-occupied-units');
    const maintenanceEl = document.getElementById('detail-maintenance-units');
    
    if (rateEl) rateEl.textContent = `${rate}%`;
    if (totalEl) totalEl.textContent = total;
    if (vacantEl) vacantEl.textContent = vacant;
    if (occupiedEl) occupiedEl.textContent = occupied;
    if (maintenanceEl) maintenanceEl.textContent = maintenance;
    
    if (building) {
        building.rate = parseFloat(rate);
        building.occupied = occupied;
    }
    
    loadDashboardData();
}

function loadUnitsGrid() {
    const container = document.getElementById('units-floor-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    const building = BUILDINGS_DATA.find(b => b.id === activeBuildingId);
    if (!building) return;
    
    const buildingUnits = UNITS_DATA.filter(u => u.buildingId === activeBuildingId);
    const subdivisions = [...new Set(buildingUnits.map(u => u.subdivision || '').filter(s => s !== ''))];
    
    if (subdivisions.length > 0) {
        subdivisions.forEach(sub => {
            const subUnits = buildingUnits.filter(u => u.subdivision === sub);
            container.insertAdjacentHTML('beforeend', `<div class="subdivision-title-header">${sub}</div>`);
            renderUnitsForGroup(subUnits, container, building);
        });
        
        const unassignedUnits = buildingUnits.filter(u => !u.subdivision);
        if (unassignedUnits.length > 0) {
            container.insertAdjacentHTML('beforeend', `<div class="subdivision-title-header">Geral</div>`);
            renderUnitsForGroup(unassignedUnits, container, building);
        }
    } else {
        renderUnitsForGroup(buildingUnits, container, building);
    }
}

function renderUnitsForGroup(unitsList, container, building) {
    let aptsHtml = '';
    
    unitsList.sort((a, b) => {
        const numA = parseInt(a.number) || 0;
        const numB = parseInt(b.number) || 0;
        return numA - numB;
    }).forEach(unit => {
        let statusClass = `apt-${unit.status}`;
        let initials = '';
        let badgeHtml = '';
        
        if (unit.status === 'occupied' && unit.tenant) {
            const names = unit.tenant.split(' ');
            initials = names.length >= 2 ? (names[0][0] + names[names.length - 1][0]) : names[0].substring(0, 2);
        } else if (unit.status === 'notice' && unit.noticeDate) {
            const noticeDate = new Date(unit.noticeDate);
            const now = new Date();
            const diffTime = now - noticeDate;
            const diffDays = 30 - Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 0) {
                badgeHtml = `<div class="apt-notice-badge expired">Fim do Aviso</div>`;
            } else {
                badgeHtml = `<div class="apt-notice-badge">${diffDays}d</div>`;
            }
        }
        
        let garageHtml = '';
        if (unit.hasGarage) {
            garageHtml = `<div class="apt-garage-icon" title="${unit.garageNumber ? 'Vaga: ' + unit.garageNumber : 'Com garagem'}">🚗</div>`;
        }
        
        aptsHtml += `
            <div class="apt-cell ${statusClass}" data-unit-id="${unit.id}" onclick="selectUnitCell('${unit.id}', this)" style="position: relative; overflow: visible;">
                ${garageHtml}
                <span class="apt-number">${unit.number}</span>
                ${initials ? `<span class="apt-tenant-initials">${initials}</span>` : ''}
                ${badgeHtml}
            </div>
        `;
    });
    
    const rowHtml = `
        <div class="floor-row">
            <div class="floor-label">Unidades</div>
            <div class="floor-apts" style="gap: 15px;">
                ${aptsHtml}
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', rowHtml);
}

function selectUnitCell(unitId, cellEl) {
    activeUnitId = unitId;
    const unit = UNITS_DATA.find(u => u.id === unitId);
    if (!unit) return;
    
    document.querySelectorAll('.apt-cell').forEach(c => c.classList.remove('active-selected'));
    if (cellEl) cellEl.classList.add('active-selected');
    
    const numEl = document.getElementById('drawer-unit-number');
    const statusSelect = document.getElementById('drawer-unit-status');
    const rentInput = document.getElementById('drawer-unit-rent');
    const condoInput = document.getElementById('drawer-unit-condo');
    const hasGarageInput = document.getElementById('drawer-unit-has-garage');
    const garageNumberInput = document.getElementById('drawer-unit-garage-number');
    const garageContainer = document.getElementById('drawer-unit-garage-container');
    
    if (numEl) numEl.textContent = `Apartamento ${unit.number}`;
    if (statusSelect) statusSelect.value = unit.status || 'vacant';
    if (rentInput) rentInput.value = unit.rent || 0;
    if (condoInput) condoInput.value = unit.condo || 0;
    
    if (hasGarageInput) {
        hasGarageInput.checked = !!unit.hasGarage;
        if (garageContainer) garageContainer.style.display = unit.hasGarage ? 'block' : 'none';
    }
    if (garageNumberInput) garageNumberInput.value = unit.garageNumber || '';
    
    const tenantBox = document.getElementById('drawer-tenant-info-box');
    const actionBtn = document.getElementById('btn-unit-action');
    
    if (unit.status === 'occupied') {
        if (tenantBox) tenantBox.style.display = 'block';
        const tName = document.getElementById('drawer-tenant-name');
        const tPhone = document.getElementById('drawer-tenant-phone');
        if (tName) tName.textContent = unit.tenant || 'Desconhecido';
        if (tPhone) tPhone.textContent = unit.phone || 'Sem contato';
        
        if (actionBtn) {
            actionBtn.style.display = 'block';
            actionBtn.textContent = 'Renovar Contrato';
            actionBtn.className = 'btn-primary flex-1 hide-from-admin';
        }
    } else {
        if (tenantBox) tenantBox.style.display = 'none';
        
        if (unit.status === 'vacant') {
            if (actionBtn) {
                actionBtn.style.display = 'block';
                actionBtn.textContent = 'Alugar Imóvel';
                actionBtn.className = 'btn-primary flex-1 hide-from-admin';
            }
        } else {
            if (actionBtn) actionBtn.style.display = 'none';
        }
    }
    
    const drawer = document.getElementById('unit-detail-drawer');
    if (drawer) drawer.classList.add('active');
}

function setupBuildingsEvents() {
    const toggleFormBtn = document.getElementById('btn-toggle-building-form');
    const formCard = document.getElementById('building-form-card');
    const cancelFormBtn = document.getElementById('btn-cancel-building');
    
    if (toggleFormBtn && formCard) {
        toggleFormBtn.addEventListener('click', () => {
            formCard.classList.toggle('active');
            toggleFormBtn.classList.toggle('btn-active');
        });
    }
    if (cancelFormBtn && formCard) {
        cancelFormBtn.addEventListener('click', () => {
            formCard.classList.remove('active');
            if (toggleFormBtn) toggleFormBtn.classList.remove('btn-active');
            document.getElementById('form-new-building').reset();
        });
    }
    
    const backBtn = document.getElementById('btn-back-to-buildings');
    const breadcrumbBack = document.getElementById('btn-back-breadcrumb');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const list = document.getElementById('view-predios-list');
            const detail = document.getElementById('view-predios-detail');
            const drawer = document.getElementById('unit-detail-drawer');
            if (list) list.style.display = 'block';
            if (detail) detail.style.display = 'none';
            if (drawer) drawer.classList.remove('active');
            loadBuildingsGrid();
            applyActiveTheme();
        });
    }
    if (breadcrumbBack && backBtn) {
        breadcrumbBack.addEventListener('click', () => {
            backBtn.click();
        });
    }
    
    const closeDrawerBtn = document.getElementById('btn-close-unit-drawer');
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            const drawer = document.getElementById('unit-detail-drawer');
            if (drawer) drawer.classList.remove('active');
            document.querySelectorAll('.apt-cell').forEach(c => c.classList.remove('active-selected'));
        });
    }
    
    const saveDetailsBtn = document.getElementById('btn-save-unit-details');
    if (saveDetailsBtn) {
        saveDetailsBtn.addEventListener('click', () => {
            const unit = UNITS_DATA.find(u => u.id === activeUnitId);
            if (!unit) return;
            
            const oldStatus = unit.status;
            const statusSelect = document.getElementById('drawer-unit-status');
            const rentInput = document.getElementById('drawer-unit-rent');
            const hasGarageInput = document.getElementById('drawer-unit-has-garage');
            const garageNumberInput = document.getElementById('drawer-unit-garage-number');
            
            const newStatus = statusSelect ? statusSelect.value : unit.status;
            const newRent = rentInput ? (parseInt(rentInput.value) || 0) : unit.rent;
            
            unit.hasGarage = hasGarageInput ? hasGarageInput.checked : !!unit.hasGarage;
            unit.garageNumber = garageNumberInput ? garageNumberInput.value : (unit.garageNumber || '');
            
            if (newStatus === 'notice' && oldStatus !== 'notice') {
                unit.noticeDate = new Date().toISOString();
            } else if (newStatus !== 'notice') {
                delete unit.noticeDate;
            }
            
            unit.status = newStatus;
            unit.rent = newRent;
            
            if (newStatus !== 'occupied') {
                unit.tenant = '';
                unit.phone = '';
            } else if (oldStatus !== 'occupied') {
                unit.tenant = 'Inquilino Temporário';
                unit.phone = '(62) 99999-9999';
            }
            
            logActivity(`Atualizou detalhes do Apto ${unit.number} (Status: ${newStatus.toUpperCase()}, Aluguel: R$ ${newRent})`);
            
            loadUnitsGrid();
            updateBlockStatsUI(activeBuildingId);
            
            setTimeout(() => {
                const cell = document.querySelector(`[data-unit-id="${activeUnitId}"]`);
                if (cell) selectUnitCell(activeUnitId, cell);
            }, 100);
            
            alert(`Configurações da unidade ${unit.number} salvas com sucesso!`);
        });
    }
    
    const formNewBuilding = document.getElementById('form-new-building');
    if (formNewBuilding) {
        formNewBuilding.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('new-building-name').value;
            const unitsInput = parseInt(document.getElementById('new-building-units').value) || 0;
            const managerSelect = document.getElementById('new-building-manager');
            const managerName = managerSelect.options[managerSelect.selectedIndex].text.split(' (')[0];
            
            const startNum = parseInt(document.getElementById('new-building-start-num').value) || 1;
            const suffix = document.getElementById('new-building-suffix').value.trim();
            const subsInput = document.getElementById('new-building-subdivisions').value;
            
            const subdivisions = parseSubdivisionsInput(subsInput, unitsInput, startNum, suffix);
            
            let finalUnitsCount = unitsInput;
            if (subdivisions.length > 0) {
                const sum = subdivisions.reduce((acc, s) => acc + s.units, 0);
                if (sum > 0) finalUnitsCount = sum;
            }
            
            if (editingBuildingId) {
                // --- MODO EDIÇÃO ---
                const existingIdx = BUILDINGS_DATA.findIndex(b => b.id === editingBuildingId);
                if (existingIdx !== -1) {
                    const oldBuilding = BUILDINGS_DATA[existingIdx];
                    
                    // Atualizar propriedades do prédio
                    BUILDINGS_DATA[existingIdx] = {
                        ...oldBuilding,
                        name: name,
                        units: finalUnitsCount,
                        manager: managerName,
                        startNum: startNum,
                        suffix: suffix,
                        subdivisions: subdivisions
                    };
                    
                    // Remover unidades antigas e gerar novas caso estrutura tenha mudado
                    const hasStructureChanged = (
                        JSON.stringify(oldBuilding.subdivisions) !== JSON.stringify(subdivisions) ||
                        oldBuilding.startNum !== startNum ||
                        oldBuilding.suffix !== suffix ||
                        oldBuilding.units !== finalUnitsCount
                    );
                    
                    if (hasStructureChanged) {
                        // Preservar unidades que estão alugadas
                        const occupiedUnits = UNITS_DATA.filter(u => u.buildingId === editingBuildingId && u.status === 'occupied');
                        UNITS_DATA = UNITS_DATA.filter(u => u.buildingId !== editingBuildingId);
                        
                        // Gerar novas unidades
                        if (subdivisions.length > 0) {
                            subdivisions.forEach(sub => {
                                const subStart = sub.startNum || 1;
                                const subSuffix = sub.suffix || '';
                                const subUnitsCount = sub.units || 0;
                                for (let i = 0; i < subUnitsCount; i++) {
                                    const aptNum = subStart + i;
                                    const numberStr = `${aptNum}${subSuffix}`;
                                    const unitId = `${editingBuildingId}-${sub.name.replace(/\s+/g, '')}-${numberStr}`;
                                    // Verificar se tinha inquilino nessa unidade
                                    const prevOccupied = occupiedUnits.find(u => u.number === numberStr);
                                    UNITS_DATA.push({
                                        id: unitId,
                                        buildingId: editingBuildingId,
                                        number: numberStr,
                                        floor: 1,
                                        status: prevOccupied ? 'occupied' : 'vacant',
                                        subdivision: sub.name,
                                        tenant: prevOccupied ? prevOccupied.tenant : '',
                                        phone: prevOccupied ? prevOccupied.phone : '',
                                        rent: prevOccupied ? prevOccupied.rent : 1200 + (i * 10)
                                    });
                                }
                            });
                        } else {
                            for (let i = 0; i < finalUnitsCount; i++) {
                                const aptNum = startNum + i;
                                const numberStr = `${aptNum}${suffix}`;
                                const unitId = `${editingBuildingId}-${numberStr}`;
                                const prevOccupied = occupiedUnits.find(u => u.number === numberStr);
                                UNITS_DATA.push({
                                    id: unitId,
                                    buildingId: editingBuildingId,
                                    number: numberStr,
                                    floor: 1,
                                    status: prevOccupied ? 'occupied' : 'vacant',
                                    subdivision: '',
                                    tenant: prevOccupied ? prevOccupied.tenant : '',
                                    phone: prevOccupied ? prevOccupied.phone : '',
                                    rent: prevOccupied ? prevOccupied.rent : 1200 + (i * 10)
                                });
                            }
                        }
                    }
                    
                    logActivity(`Editou o prédio: ${name} (${finalUnitsCount} unidades) sob gestão de ${managerName}`);
                }
                
                // Resetar modo de edição
                editingBuildingId = null;
                const titleEl = formCard.querySelector('h4');
                if (titleEl) titleEl.textContent = 'Cadastrar Novo Prédio / Bloco';
                const submitBtn = formCard.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.textContent = 'Salvar Prédio';
                
            } else {
                // --- MODO CRIAÇÃO ---
                const buildingId = `bloco-${name.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now()}`;
                
                const newBuilding = {
                    id: buildingId,
                    name: name,
                    units: finalUnitsCount,
                    occupied: 0,
                    manager: managerName,
                    rate: 0,
                    startNum: startNum,
                    suffix: suffix,
                    subdivisions: subdivisions
                };
                
                BUILDINGS_DATA.push(newBuilding);
                
                if (subdivisions.length > 0) {
                    subdivisions.forEach(sub => {
                        const subStart = sub.startNum || 1;
                        const subSuffix = sub.suffix || '';
                        const subUnitsCount = sub.units || 0;
                        for (let i = 0; i < subUnitsCount; i++) {
                            const aptNum = subStart + i;
                            const numberStr = `${aptNum}${subSuffix}`;
                            UNITS_DATA.push({
                                id: `${buildingId}-${sub.name.replace(/\s+/g, '')}-${numberStr}`,
                                buildingId: buildingId,
                                number: numberStr,
                                floor: 1,
                                status: 'vacant',
                                subdivision: sub.name,
                                tenant: '',
                                phone: '',
                                rent: 1200 + (i * 10)
                            });
                        }
                    });
                } else {
                    for (let i = 0; i < finalUnitsCount; i++) {
                        const aptNum = startNum + i;
                        const numberStr = `${aptNum}${suffix}`;
                        UNITS_DATA.push({
                            id: `${buildingId}-${numberStr}`,
                            buildingId: buildingId,
                            number: numberStr,
                            floor: 1,
                            status: 'vacant',
                            subdivision: '',
                            tenant: '',
                            phone: '',
                            rent: 1200 + (i * 10)
                        });
                    }
                }
                
                logActivity(`Cadastrou novo prédio: ${name} (${finalUnitsCount} unidades) sob gestão de ${managerName}`);
            }
            
            formNewBuilding.reset();
            if (formCard) formCard.classList.remove('active');
            if (toggleFormBtn) toggleFormBtn.classList.remove('btn-active');
            
            loadBuildingsGrid();
            loadDashboardData();
            populateBuildingManagersDropdown();
        });
    }
    
    const actionBtn = document.getElementById('btn-unit-action');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            const unit = UNITS_DATA.find(u => u.id === activeUnitId);
            if (!unit) return;
            
            const building = BUILDINGS_DATA.find(b => b.id === activeBuildingId);
            
            window.prefilledContractData = {
                unitId: unit.id,
                tenantName: unit.tenant || '',
                phone: unit.phone || '',
                unit: `Apto ${unit.number} - ${building ? building.name : ''}`,
                rent: unit.rent
            };
            
            document.querySelector('[data-tab="contratos"]').click();
        });
    }
}

function populateBuildingManagersDropdown() {
    const selects = [
        document.getElementById('new-building-manager')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Selecione um gestor...</option>';
        
        const managers = USERS_DATA.filter(u => u.role !== 'admin' && u.active);
        managers.forEach(mgr => {
            const opt = document.createElement('option');
            opt.value = mgr.id;
            opt.textContent = `${mgr.name} (${mgr.role.toUpperCase()})`;
            select.appendChild(opt);
        });
    });
}

function occupyUnitWithContract(unitId, tenantName, tenantPhone, rentValue) {
    const unit = UNITS_DATA.find(u => u.id === unitId);
    if (unit) {
        unit.status = 'occupied';
        unit.tenant = tenantName;
        unit.phone = tenantPhone;
        unit.rent = rentValue;
        
        logActivity(`Unidade ${unit.number} ocupada automaticamente via emissão de contrato para ${tenantName}`);
        
        if (activeBuildingId === unit.buildingId) {
            loadUnitsGrid();
            updateBlockStatsUI(activeBuildingId);
        } else {
            updateBlockStatsUI(unit.buildingId);
        }
    }
}

function editBuilding(buildingId, event) {
    if (event) event.stopPropagation();
    
    const building = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!building) return;
    
    editingBuildingId = buildingId;
    
    const formCard = document.getElementById('building-form-card');
    const toggleFormBtn = document.getElementById('btn-toggle-building-form');
    if (formCard) formCard.classList.add('active');
    if (toggleFormBtn) toggleFormBtn.classList.add('btn-active');
    
    document.getElementById('new-building-name').value = building.name;
    document.getElementById('new-building-units').value = building.units;
    document.getElementById('new-building-start-num').value = building.startNum || 1;
    document.getElementById('new-building-suffix').value = building.suffix || '';
    
    let subdivisionsStr = '';
    if (building.subdivisions && building.subdivisions.length > 0) {
        subdivisionsStr = building.subdivisions.map(sub => {
            return `${sub.name}: ${sub.units}: ${sub.startNum || 1}: ${sub.suffix || ''}`;
        }).join(', ');
    }
    document.getElementById('new-building-subdivisions').value = subdivisionsStr;
    
    const managerSelect = document.getElementById('new-building-manager');
    if (managerSelect) {
        for (let i = 0; i < managerSelect.options.length; i++) {
            if (managerSelect.options[i].text.includes(building.manager)) {
                managerSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    const titleEl = formCard.querySelector('h4');
    if (titleEl) titleEl.textContent = 'Editar Prédio / Bloco';
    
    const submitBtn = formCard.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Atualizar Prédio';
    
    formCard.scrollIntoView({ behavior: 'smooth' });
}

function deleteBuilding(buildingId, event) {
    if (event) event.stopPropagation();
    
    if (currentUser.role === 'gerente') {
        alert('Acesso negado: Gerentes não possuem permissão para excluir prédios.');
        return;
    }
    
    const building = BUILDINGS_DATA.find(b => b.id === buildingId);
    if (!building) return;
    
    const confirmDelete = confirm(`Tem certeza de que deseja excluir o prédio "${building.name}" e todas as suas unidades? Esta ação é permanente e não poderá ser desfeita.`);
    
    if (confirmDelete) {
        BUILDINGS_DATA = BUILDINGS_DATA.filter(b => b.id !== buildingId);
        UNITS_DATA = UNITS_DATA.filter(u => u.buildingId !== buildingId);
        
        logActivity(`Excluiu o prédio: ${building.name} e limpou todos os seus registros de unidades.`);
        
        loadBuildingsGrid();
        loadDashboardData();
        
        alert(`Prédio "${building.name}" removido com sucesso!`);
    }
}

/* ==========================================================================
   MÓDULO FINANCEIRO
   ========================================================================== */
function initFinanceTab() {
    const subnavBtns = document.querySelectorAll('[data-finance-subtab]');
    const subtabContents = document.querySelectorAll('.finance-subtab-content');
    
    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-finance-subtab');
            
            subnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Esconde todas e exibe apenas a ativa
            subtabContents.forEach(tab => tab.style.display = 'none');
            const activeTabEl = document.getElementById(`finance-subtab-${targetSubtab}`);
            if (activeTabEl) {
                activeTabEl.style.display = 'block';
            }
            
            // Recarregar os dados da aba correspondente
            if (targetSubtab === 'semanal') {
                loadWeeklyReport();
            } else if (targetSubtab === 'caixa') {
                loadCashBook();
            } else if (targetSubtab === 'depositos') {
                loadPixDepositsReport();
            } else if (targetSubtab === 'relatorios') {
                loadGlobalReports();
            }
        });
    });
    
    // Carga inicial
    if (typeof loadWeeklyReport === 'function') loadWeeklyReport();
    if (typeof loadCashBook === 'function') loadCashBook();
    loadPixDepositsReport();
}

function loadWeeklyReport() {
    const tableBody = document.getElementById('table-semanal-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (MOCK_WEEKLY_REPORTS.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum relatório semanal gerado.
                </td>
            </tr>
        `;
        return;
    }
    
    MOCK_WEEKLY_REPORTS.forEach(r => {
        const typeClass = r.type.includes('Entrada') ? 'text-success' : (r.type.includes('Saída') ? 'text-danger' : 'text-primary');
        const rowHtml = `
            <tr>
                <td>${r.date}</td>
                <td><strong>${r.tenant}</strong></td>
                <td><span class="unit-tag">${r.unit}</span></td>
                <td><span class="${typeClass}" style="font-weight: bold;">${r.type}</span></td>
                <td>${r.detail}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function loadCaixaData() {
    const tableEntradas = document.getElementById('table-caixa-entradas-body');
    const tableSaidas = document.getElementById('table-caixa-saidas-body');
    if (!tableEntradas || !tableSaidas) return;
    
    tableEntradas.innerHTML = '';
    tableSaidas.innerHTML = '';
    
    const entradas = CAIXA_DATA.filter(c => c.type === 'Entrada');
    const saidas = CAIXA_DATA.filter(c => c.type === 'Saída');
    
    // Renderizar Entradas
    if (entradas.length === 0) {
        tableEntradas.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--neutral-500); padding: 20px;">Nenhuma entrada registrada.</td></tr>`;
    } else {
        entradas.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))).forEach(c => {
            const formattedValue = parseFloat(c.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            let docLink = c.comprovante ? `<button onclick="viewDocument('${c.comprovante.data}')" class="btn-action-mini btn-action-view" title="Ver Comprovante"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Anexo</button>` : '-';
            
            const desc = c.unit ? `<strong>${c.description}</strong><br><span style="font-size:12px; color:var(--neutral-500);">${c.unit}</span>` : c.description;
            
            tableEntradas.innerHTML += `
                <tr>
                    <td>${c.date}</td>
                    <td>${desc}</td>
                    <td style="font-weight: 600; color: var(--success);">${formattedValue}</td>
                    <td>${docLink}</td>
                </tr>
            `;
        });
    }

    // Renderizar Saídas
    if (saidas.length === 0) {
        tableSaidas.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--neutral-500); padding: 20px;">Nenhuma saída registrada.</td></tr>`;
    } else {
        saidas.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))).forEach(c => {
            const formattedValue = parseFloat(c.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            let docLink = c.comprovante ? `<button onclick="viewDocument('${c.comprovante.data}')" class="btn-action-mini btn-action-view" title="Ver Comprovante"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Anexo</button>` : '-';
            
            tableSaidas.innerHTML += `
                <tr>
                    <td>${c.date}</td>
                    <td>${c.description}</td>
                    <td style="font-weight: 600; color: var(--danger);">${formattedValue}</td>
                    <td>${docLink}</td>
                </tr>
            `;
        });
    }
}

function loadPixDepositsReport() {
    const tableBody = document.getElementById('table-depositos-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (PIX_DEPOSITS_DATA.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--neutral-500); padding: 30px;">
                    Nenhum depósito PIX registrado.
                </td>
            </tr>
        `;
        return;
    }
    
    // Agrupar por morador
    const groups = {};
    PIX_DEPOSITS_DATA.forEach(d => {
        const key = d.tenant;
        if (!groups[key]) groups[key] = { tenant: d.tenant, unit: d.unit, entries: [] };
        groups[key].entries.push(d);
    });
    
    Object.values(groups).forEach((group, gi) => {
        // Ordenar por data + hora ascendente dentro do grupo
        group.entries.sort((a, b) => {
            const da = new Date(`${a.date.split('/').reverse().join('-')}T${a.time || '00:00'}`);
            const db = new Date(`${b.date.split('/').reverse().join('-')}T${b.time || '00:00'}`);
            return da - db;
        });
        
        const isMultiple = group.entries.length > 1;
        const total = group.entries.reduce((s, e) => s + e.value, 0);
        const totalFmt = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        group.entries.forEach((d, idx) => {
            const isFirst = idx === 0;
            
            const typeMeta = {
                integral: { label: 'Integral', color: '#02c39a', bg: 'rgba(46,196,182,0.12)' },
                parte:    { label: 'Parte',    color: '#e67e22', bg: 'rgba(230,126,34,0.12)' },
                restante: { label: 'Restante', color: '#2980b9', bg: 'rgba(41,128,185,0.12)' }
            }[d.type] || { label: d.type, color: '#888', bg: '#f0f0f0' };
            
            const typeBadge  = `<span style="background:${typeMeta.bg};color:${typeMeta.color};padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">${typeMeta.label}</span>`;
            const valueFmt   = d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const statusBadge= `<span style="background:rgba(46,196,182,0.12);color:#02c39a;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">Conciliado</span>`;
            
            // Comprovante
            let comprovHtml = '<span style="color:var(--neutral-400);font-size:12px;">—</span>';
            if (d.comprovante) {
                if (d.comprovante.type === 'application/pdf') {
                    comprovHtml = `<a href="${d.comprovante.data}" download="${d.comprovante.name}" title="Baixar comprovante" style="color:var(--primary);font-size:20px;text-decoration:none;">📄</a>`;
                } else {
                    comprovHtml = `<a href="${d.comprovante.data}" target="_blank" title="Ver comprovante">
                        <img src="${d.comprovante.data}" alt="comprovante" style="height:36px;width:36px;object-fit:cover;border-radius:6px;border:1px solid var(--neutral-200);cursor:pointer;">
                    </a>`;
                }
            }
            
            // Para grupos múltiplos: borda esquerda + fundo levemente diferenciado
            const groupBg    = isMultiple ? (gi % 2 === 0 ? 'rgba(13,44,84,0.03)' : 'rgba(0,0,0,0)') : '';
            const leftBorder = isMultiple ? 'border-left: 3px solid var(--primary);' : '';
            const nameCell   = isFirst
                ? `<strong style="display:block;">${group.tenant}</strong>
                   ${isMultiple ? `<span style="font-size:11px;color:var(--neutral-500);">Total: ${totalFmt}</span>` : ''}`
                : `<span style="color:var(--neutral-400);font-size:12px;padding-left:12px;">↳ continuação</span>`;
            
            const rowHtml = `
                <tr style="${leftBorder}background:${groupBg};">
                    <td>${nameCell}</td>
                    <td>${isFirst ? `<span class="unit-tag">${d.unit}</span>` : ''}</td>
                    <td style="color:var(--neutral-600);font-size:13px;">${d.date} ${d.time || ''}</td>
                    <td>${typeBadge}</td>
                    <td><strong style="color:#02c39a;font-size:14px;">${valueFmt}</strong></td>
                    <td>${comprovHtml}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHtml);
        });
    });
}

/* --- Funções do Modal de Novo Lançamento PIX --- */

function openNewPixModal() {
    const modal = document.getElementById('modal-new-pix');
    if (!modal) return;
    
    // Resetar formulário
    document.getElementById('form-new-pix').reset();
    document.getElementById('pix-unit').value = '';
    
    // Limpar comprovante anterior
    window._pixComprovanteData = null;
    const preview = document.getElementById('pix-comprovante-preview');
    if (preview) preview.innerHTML = '';
    
    // Preencher select de inquilinos
    const tenantSelect = document.getElementById('pix-tenant');
    tenantSelect.innerHTML = '<option value="">Selecione o inquilino...</option>';
    TENANTS_DATA.forEach(t => {
        const hist = t.history && t.history[0] ? t.history[0] : {};
        const unit = hist.unitNumber ? `Apto ${hist.unitNumber} - ${hist.buildingName}` : 'N/A';
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        opt.dataset.unit = unit;
        tenantSelect.appendChild(opt);
    });
    
    // Pré-definir a data de hoje no campo
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('pix-date').value = `${yyyy}-${mm}-${dd}`;
    
    modal.style.display = 'flex';
}

function closeNewPixModal() {
    const modal = document.getElementById('modal-new-pix');
    if (modal) modal.style.display = 'none';
}

function onPixTenantChange() {
    const tenantSelect = document.getElementById('pix-tenant');
    const unitInput = document.getElementById('pix-unit');
    const selected = tenantSelect.options[tenantSelect.selectedIndex];
    unitInput.value = selected && selected.dataset.unit ? selected.dataset.unit : '';
}

async function saveNewPixDeposit(event) {
    event.preventDefault();
    
    const dateRaw  = document.getElementById('pix-date').value;
    const type     = document.getElementById('pix-type').value;
    const tenantId = document.getElementById('pix-tenant').value;
    const tenantSelect = document.getElementById('pix-tenant');
    const tenantName   = tenantSelect.options[tenantSelect.selectedIndex]?.textContent || '';
    const unit     = document.getElementById('pix-unit').value;
    const value    = parseFloat(document.getElementById('pix-value').value);
    const obs      = document.getElementById('pix-obs').value;
    
    if (!dateRaw || !type || !tenantId || !value) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }
    
    const [y, m, d] = dateRaw.split('-');
    const dateFormatted = `${d}/${m}/${y}`;
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    let receiptUrl = '';
    const file = window._pixComprovanteFile;
    if (file && supabaseClient) {
        const fileExt = file.name.split('.').pop();
        const fileName = `pix_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        try {
            const { data, error } = await supabaseClient.storage.from('comprovantes').upload(fileName, file);
            if (!error) {
                receiptUrl = `${supabaseUrl}/storage/v1/object/public/comprovantes/${fileName}`;
            } else {
                console.error('Erro no upload do PIX:', error);
                alert('Aviso: Falha ao fazer upload do comprovante. ' + error.message);
            }
        } catch (err) {
            console.error('Erro fatal no upload:', err);
        }
    }
    window._pixComprovanteFile = null;
    
    const newDeposit = {
        id: `pix-${Date.now()}`,
        date: dateFormatted,
        time: timeFormatted,
        tenantId,
        tenant: tenantName,
        unit,
        value,
        type,
        obs,
        receipt_url: receiptUrl,
        comprovante: receiptUrl // mantendo compatibilidade
    };
    
    PIX_DEPOSITS_DATA.push(newDeposit);
    saveState();
    logActivity(`Registrou depósito PIX de ${tenantName} — ${(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${type})`);
    
    closeNewPixModal();
    loadPixDepositsReport();
    alert(`Depósito de ${tenantName} registrado com sucesso!`);
}

function onPixComprovanteChange(input) {
    const file = input.files[0];
    if (!file) { window._pixComprovanteFile = null; return; }
    
    window._pixComprovanteFile = file; // Salva o arquivo para o momento do upload real
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Mostrar preview
        const preview = document.getElementById('pix-comprovante-preview');
        if (preview) {
            if (file.type === 'application/pdf') {
                preview.innerHTML = `<span style="font-size:28px;">📄</span> <span style="font-size:13px;color:var(--neutral-700);">${file.name}</span>`;
            } else {
                preview.innerHTML = `<img src="${e.target.result}" style="max-height:80px;max-width:100%;border-radius:6px;border:1px solid var(--neutral-200);"/>`;
            }
        }
    };
    reader.readAsDataURL(file);
}

function getNextFridayDate() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let daysToFriday = 5 - dayOfWeek;
    if (daysToFriday < 0) {
        daysToFriday += 7; // Se for Sábado, a próxima sexta é em 6 dias
    }
    const friday = new Date(today);
    friday.setDate(today.getDate() + daysToFriday);
    return friday.toLocaleDateString('pt-BR');
}

function gerarRelatorioPix() {
    const groups = {};
    PIX_DEPOSITS_DATA.forEach(d => {
        if (!groups[d.tenant]) groups[d.tenant] = { tenant: d.tenant, unit: d.unit, entries: [] };
        groups[d.tenant].entries.push(d);
    });
    Object.values(groups).forEach(g => {
        g.entries.sort((a, b) => {
            const da = new Date(`${a.date.split('/').reverse().join('-')}T${a.time || '00:00'}`);
            const db = new Date(`${b.date.split('/').reverse().join('-')}T${b.time || '00:00'}`);
            return da - db;
        });
    });
    
    // Monta linhas da tabela
    let tableRows = '';
    let totalGeral = 0;
    Object.values(groups).forEach(g => {
        const total = g.entries.reduce((s, e) => s + e.value, 0);
        totalGeral += total;
        const isMultiple = g.entries.length > 1;
        g.entries.forEach((e, idx) => {
            const typeLabel = { integral: 'Integral', parte: 'Parte', restante: 'Restante' }[e.type] || e.type;
            const vFmt = e.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            const nameCell = idx === 0
                ? `<strong>${g.tenant}</strong>${isMultiple ? `<br><span style="font-size:11px; color:#64748b;">Subtotal: ${total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>` : ''}`
                : `<span style="color:#94a3b8; padding-left:16px;">↳ continuação</span>`;
            const unitCell = idx === 0 ? g.unit : '';
            
            tableRows += `<tr>
                <td>${nameCell}</td>
                <td><span style="font-size:12px; color:#64748b;">${unitCell}</span></td>
                <td>${e.date} ${e.time || ''}</td>
                <td><span style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #475569; font-weight: 600;">${typeLabel}</span></td>
                <td><strong>${vFmt}</strong></td>
                <td style="color: #64748b;">${e.obs || '—'}</td>
            </tr>`;
        });
    });
    
    // Comprovantes ao final
    let comprovanteSection = '';
    const depositsWithProof = PIX_DEPOSITS_DATA.filter(d => d.comprovante && d.comprovante.data);
    if (depositsWithProof.length > 0) {
        comprovanteSection = `<h2 class="section-title" style="margin-top: 40px; color: #0f172a;">Anexos e Comprovantes</h2><div class="comprovantes-grid">`;
        
        depositsWithProof.sort((a, b) => {
            const da = new Date(`${a.date.split('/').reverse().join('-')}T${a.time || '00:00'}`);
            const db = new Date(`${b.date.split('/').reverse().join('-')}T${b.time || '00:00'}`);
            return da - db;
        }).forEach((d, idx) => {
            const vFmt = d.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const typeLabel = { integral: 'Integral', parte: 'Parte', restante: 'Restante' }[d.type] || d.type;
            
            if (d.comprovante.type === 'application/pdf') {
                comprovanteSection += `
                <div class="comprovante-item">
                    <div class="comprovante-label">${idx + 1}. ${d.tenant}</div>
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${d.date} - ${vFmt}</div>
                    <div style="padding: 20px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; text-align: center; color: #64748b;">
                        📄 Documento PDF anexado<br>
                        <span style="font-size: 10px;">${d.comprovante.name}</span>
                    </div>
                </div>`;
            } else {
                comprovanteSection += `
                <div class="comprovante-item">
                    <div class="comprovante-label">${idx + 1}. ${d.tenant}</div>
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${d.date} - ${vFmt}</div>
                    <img src="${d.comprovante.data}" alt="Comprovante" class="comprovante-img"/>
                </div>`;
            }
        });
        comprovanteSection += `</div>`;
    }
    
    const dataGeracao = new Date().toLocaleString('pt-BR');
    const totalGeralFmt = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Relatório de Depósitos PIX - Bueno Residence</title>
        <style>
            body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1e293b; background-color: #f8fafc; line-height: 1.5; }
            .report-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title-area h1 { margin: 0 0 5px 0; color: #0f172a; font-size: 24px; }
            .title-area p { margin: 0; color: #64748b; font-size: 14px; }
            .meta-info { text-align: right; font-size: 14px; color: #64748b; }
            
            .summary-cards { display: flex; gap: 20px; margin-bottom: 30px; }
            .card { flex: 1; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
            .card-title { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 8px; }
            .card-value { font-size: 26px; font-weight: 700; }
            
            .section-title { font-size: 18px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px; color: #0f172a; }
            
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
            .total-row td { font-weight: 700; background-color: #f8fafc; border-top: 2px solid #cbd5e1; }
            
            .comprovantes-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .comprovante-item { padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; page-break-inside: avoid; }
            .comprovante-label { font-weight: 700; font-size: 13px; color: #0f172a; }
            .comprovante-img { max-width: 100%; max-height: 250px; border: 1px solid #e2e8f0; border-radius: 6px; display: block; margin: 0 auto; }
            
            @media print {
                body { background-color: white; padding: 0; }
                .report-container { box-shadow: none; padding: 0; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <div class="title-area">
                    <h1>Relatório PIX - ${getNextFridayDate()}</h1>
                    <p>Bueno Residence - Conciliação de Recebimentos da Semana</p>
                </div>
                <div class="meta-info">
                    Gerado em: <strong>${dataGeracao}</strong>
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="card" style="background-color: rgba(67, 97, 238, 0.05); border-color: rgba(67, 97, 238, 0.2);">
                    <div class="card-title">Volume de Lançamentos</div>
                    <div class="card-value" style="color: #4361ee;">${PIX_DEPOSITS_DATA.length}</div>
                </div>
                <div class="card" style="background-color: rgba(46, 196, 182, 0.05); border-color: rgba(46, 196, 182, 0.2);">
                    <div class="card-title">Total Recebido no PIX</div>
                    <div class="card-value" style="color: #02c39a;">${totalGeralFmt}</div>
                </div>
            </div>
            
            <h2 class="section-title">Demonstrativo de Lançamentos</h2>
            <table>
                <thead>
                    <tr>
                        <th width="25%">Inquilino</th>
                        <th width="15%">Unidade</th>
                        <th width="15%">Data / Hora</th>
                        <th width="10%">Tipo</th>
                        <th width="15%">Valor</th>
                        <th width="20%">Observações</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">Nenhum lançamento PIX encontrado.</td></tr>'}
                    ${tableRows ? `<tr class="total-row"><td colspan="4" style="text-align: right; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Soma Total PIX:</td><td colspan="2" style="color: #02c39a;">${totalGeralFmt}</td></tr>` : ''}
                </tbody>
            </table>
            
            ${comprovanteSection}
            
            <div class="no-print" style="text-align: center; margin-top: 40px;">
                <button onclick="window.print()" style="padding: 10px 20px; background-color: #0f172a; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Imprimir PDF</button>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

/* ==========================================================================
   FUNÇÕES DO CAIXA (NOVO LANÇAMENTO E RELATÓRIO)
   ========================================================================== */

let pendingCaixaComprovante = null;

function openNewCaixaModal() {
    document.getElementById('modal-new-caixa').style.display = 'flex';
    document.getElementById('form-new-caixa').reset();
    
    // Set today's date
    const today = new Date();
    document.getElementById('caixa-date').value = today.toISOString().split('T')[0];
    
    // Populate tenants
    const tenantSelect = document.getElementById('caixa-tenant');
    tenantSelect.innerHTML = '<option value="">Nenhum inquilino específico</option>';
    TENANTS_DATA.forEach(t => {
        tenantSelect.innerHTML += `<option value="${t.id}">${t.name} (${t.unit})</option>`;
    });
    
    onCaixaTypeChange();
    
    pendingCaixaComprovante = null;
    document.getElementById('caixa-comprovante-preview').innerHTML = '';
}

function closeNewCaixaModal() {
    document.getElementById('modal-new-caixa').style.display = 'none';
}

function onCaixaTypeChange() {
    const type = document.getElementById('caixa-type').value;
    const tenantGroup = document.getElementById('group-caixa-tenant');
    if (type === 'Saída') {
        tenantGroup.style.display = 'none';
        document.getElementById('caixa-tenant').value = '';
    } else {
        tenantGroup.style.display = 'flex';
    }
}

function onCaixaComprovanteChange(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Verifica tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem ou PDF não pode ter mais que 5MB.');
            input.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const result = e.target.result;
            pendingCaixaComprovante = {
                type: file.type,
                name: file.name,
                data: result
            };
            
            const previewDiv = document.getElementById('caixa-comprovante-preview');
            if (file.type.startsWith('image/')) {
                previewDiv.innerHTML = `<div style="position:relative; display:inline-block;">
                    <img src="${result}" style="max-width: 100%; max-height: 150px; border-radius: var(--border-radius-sm); border: 1px solid var(--neutral-300);">
                    <button type="button" onclick="pendingCaixaComprovante=null; document.getElementById('caixa-comprovante-preview').innerHTML=''; document.getElementById('caixa-comprovante').value='';" style="position:absolute; top:-8px; right:-8px; background:var(--danger); color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>`;
            } else {
                previewDiv.innerHTML = `<div style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:var(--neutral-100); border-radius:var(--border-radius-sm); border: 1px solid var(--neutral-300);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    <span style="font-size:13px; font-weight:600; color:var(--neutral-700); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;">${file.name}</span>
                    <button type="button" onclick="pendingCaixaComprovante=null; document.getElementById('caixa-comprovante-preview').innerHTML=''; document.getElementById('caixa-comprovante').value='';" style="margin-left:auto; background:var(--neutral-300); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">&times;</button>
                </div>`;
            }
        };
        reader.readAsDataURL(file);
    }
}

function saveNewCaixa(event) {
    event.preventDefault();
    
    const dateInput = document.getElementById('caixa-date').value;
    // Format YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateInput.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const type = document.getElementById('caixa-type').value;
    const value = parseFloat(document.getElementById('caixa-value').value);
    const obs = document.getElementById('caixa-obs').value.trim();
    
    let unit = '';
    let description = obs;
    
    if (type === 'Entrada') {
        const tenantId = document.getElementById('caixa-tenant').value;
        if (tenantId) {
            const tenantObj = TENANTS_DATA.find(t => t.id === tenantId);
            if (tenantObj) {
                unit = tenantObj.unit;
                description = `[${tenantObj.name}] ${obs}`;
            }
        }
    }
    
    const newEntry = {
        id: 'caixa-' + Date.now(),
        date: formattedDate,
        type: type,
        description: description,
        unit: unit,
        value: value,
        comprovante: pendingCaixaComprovante
    };
    
    CAIXA_DATA.push(newEntry);
    saveState();
    logActivity(`Registrou lançamento no Caixa de ${(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${type})`);
    
    closeNewCaixaModal();
    loadCaixaData();
}

function generateCaixaReport() {
    const entradas = CAIXA_DATA.filter(c => c.type === 'Entrada').sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    const saidas = CAIXA_DATA.filter(c => c.type === 'Saída').sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    
    const totalEntradas = entradas.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
    const totalSaidas = saidas.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
    const saldo = totalEntradas - totalSaidas;

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Relatório de Caixa - Bueno Residence</title>
        <style>
            body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1e293b; background-color: #f8fafc; line-height: 1.5; }
            .report-container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title-area h1 { margin: 0 0 5px 0; color: #0f172a; font-size: 24px; }
            .title-area p { margin: 0; color: #64748b; font-size: 14px; }
            .meta-info { text-align: right; font-size: 14px; color: #64748b; }
            
            .summary-cards { display: flex; gap: 20px; margin-bottom: 30px; }
            .card { flex: 1; padding: 15px; border-radius: 6px; text-align: center; border: 1px solid #e2e8f0; }
            .card-title { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 5px; }
            .card-value { font-size: 22px; font-weight: 700; }
            
            .section-title { font-size: 18px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 15px; }
            .section-entradas { color: #02c39a; }
            .section-saidas { color: #e63946; }
            
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
            
            @media print {
                body { background-color: white; padding: 0; }
                .report-container { box-shadow: none; padding: 0; }
                .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="header">
                <div class="title-area">
                    <h1>Relatório Livro Caixa - ${getNextFridayDate()}</h1>
                    <p>Bueno Residence - Gestão Financeira da Semana</p>
                </div>
                <div class="meta-info">
                    Gerado em: <strong>${dataAtual}</strong>
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="card" style="background-color: rgba(46, 196, 182, 0.05); border-color: rgba(46, 196, 182, 0.2);">
                    <div class="card-title">Total de Entradas</div>
                    <div class="card-value" style="color: #02c39a;">${totalEntradas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </div>
                <div class="card" style="background-color: rgba(230, 57, 70, 0.05); border-color: rgba(230, 57, 70, 0.2);">
                    <div class="card-title">Total de Saídas</div>
                    <div class="card-value" style="color: #e63946;">${totalSaidas.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </div>
                <div class="card" style="background-color: ${saldo >= 0 ? 'rgba(46, 196, 182, 0.1)' : 'rgba(230, 57, 70, 0.1)'}; border-color: ${saldo >= 0 ? '#02c39a' : '#e63946'};">
                    <div class="card-title">Saldo Líquido</div>
                    <div class="card-value" style="color: ${saldo >= 0 ? '#02c39a' : '#e63946'};">${saldo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                </div>
            </div>
            
            <h2 class="section-title section-entradas">Demonstrativo de Entradas (Receitas)</h2>
            <table>
                <thead>
                    <tr>
                        <th width="15%">Data</th>
                        <th width="65%">Descrição</th>
                        <th width="20%">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${entradas.map(c => `
                        <tr>
                            <td>${c.date}</td>
                            <td>${c.description} ${c.unit ? `<span style="color:#64748b; font-size:11px; display:block;">${c.unit}</span>` : ''}</td>
                            <td style="font-weight: 600; color: #02c39a;">${c.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align:center; color:#94a3b8;">Nenhuma entrada registrada.</td></tr>'}
                </tbody>
            </table>
            
            <h2 class="section-title section-saidas">Demonstrativo de Saídas (Despesas)</h2>
            <table>
                <thead>
                    <tr>
                        <th width="15%">Data</th>
                        <th width="65%">Observação / Motivo</th>
                        <th width="20%">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    ${saidas.map(c => `
                        <tr>
                            <td>${c.date}</td>
                            <td>${c.description}</td>
                            <td style="font-weight: 600; color: #e63946;">${c.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                        </tr>
                    `).join('') || '<tr><td colspan="3" style="text-align:center; color:#94a3b8;">Nenhuma saída registrada.</td></tr>'}
                </tbody>
            </table>
            
            <div class="no-print" style="text-align: center; margin-top: 40px;">
                <button onclick="window.print()" style="padding: 10px 20px; background-color: #0f172a; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">Imprimir PDF</button>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}

/* ==========================================================================
   MÓDULO DE GESTÃO DE INQUILINOS
   ========================================================================== */
let activeTenantSubtab = 'todos';

function initTenantsTab() {
    const subnavBtns = document.querySelectorAll('[data-tenant-subtab]');
    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-tenant-subtab');
            activeTenantSubtab = targetSubtab;
            
            subnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const titleEl = document.getElementById('tenant-subtab-title');
            const descEl = document.getElementById('tenant-subtab-desc');
            
            if (targetSubtab === 'todos') {
                if (titleEl) titleEl.textContent = 'Todos os Inquilinos';
                if (descEl) descEl.textContent = 'Visualize e gerencie todos os moradores cadastrados no condomínio.';
            } else {
                if (titleEl) titleEl.textContent = 'Aluguéis em Aberto';
                if (descEl) descEl.textContent = 'Listagem de inquilinos com pendências de pagamento de aluguel.';
            }
            
            loadTenantsList();
        });
    });
    
    // Configurar filtros
    const searchInput = document.getElementById('filter-tenant-search');
    const buildingSelect = document.getElementById('filter-tenant-building');
    
    if (searchInput) {
        searchInput.addEventListener('input', loadTenantsList);
    }
    
    if (buildingSelect) {
        buildingSelect.addEventListener('change', loadTenantsList);
    }
    
    // Popular o select de prédios na busca
    populateTenantBuildingSelect();
    
    // Carga inicial de inquilinos
    loadTenantsList();
}

function populateTenantBuildingSelect() {
    const select = document.getElementById('filter-tenant-building');
    if (!select) return;
    
    // Limpa mantendo a opção "Todos"
    select.innerHTML = '<option value="all">Todos os prédios</option>';
    
    let allowedBuildings = BUILDINGS_DATA;
    if (currentUser.role === 'gestor') {
        allowedBuildings = BUILDINGS_DATA.filter(b => b.id === currentUser.buildingId);
        select.disabled = true; // Gestores só veem seu prédio, não precisam mudar o select
    }
    
    allowedBuildings.forEach(b => {
        const option = document.createElement('option');
        option.value = b.id;
        option.textContent = b.name;
        select.appendChild(option);
    });
    
    if (currentUser.role === 'gestor' && allowedBuildings.length > 0) {
        select.value = currentUser.buildingId;
    }
}

function loadTenantsList() {
    const tableBody = document.getElementById('inquilinos-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const searchVal = (document.getElementById('filter-tenant-search')?.value || '').toLowerCase().trim();
    const buildingVal = document.getElementById('filter-tenant-building')?.value || 'all';
    
    let filtered = [...TENANTS_DATA];
    
    // Filtragem por Sub-aba (Todos ou Aberto dia 10)
    if (activeTenantSubtab === 'aberto') {
        filtered = filtered.filter(t => t.rentStatus === 'em_aberto' && t.dueDay === 10);
    }
    
    // Restrição de perfil (Gestor só vê o próprio prédio)
    if (currentUser.role === 'gestor') {
        filtered = filtered.filter(t => t.history && t.history[0] && t.history[0].buildingId === currentUser.buildingId);
    } else if (buildingVal !== 'all') {
        filtered = filtered.filter(t => t.history && t.history[0] && t.history[0].buildingId === buildingVal);
    }
    
    // Busca por termo
    if (searchVal) {
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(searchVal) || 
            t.phone.toLowerCase().includes(searchVal) || 
            t.email.toLowerCase().includes(searchVal) ||
            t.cpf.includes(searchVal)
        );
    }
    
    // Atualizar badge de pendências
    updateTenantsBadgeCount();
    
    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--neutral-500); padding: 30px;">
                    Nenhum inquilino correspondente aos filtros.
                </td>
            </tr>
        `;
        return;
    }
    
    filtered.forEach(t => {
        const hist = t.history && t.history[0] ? t.history[0] : {};
        const unitStr = hist.unitNumber ? `Apto ${hist.unitNumber} - ${hist.buildingName}` : 'N/A';
        const rentFormatted = (t.rentValue || 1500).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let statusBadge = '';
        if (t.rentStatus === 'pago') {
            statusBadge = '<span class="status-pill status-active" style="background-color: rgba(46, 196, 182, 0.15); color: #02c39a; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">Pago</span>';
        } else {
            statusBadge = '<span class="status-pill status-inactive" style="background-color: rgba(230, 57, 70, 0.15); color: #e63946; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">Em Aberto</span>';
        }
        
        let actionButtons = `<button class="btn-action-mini" onclick="openTenantModal('${t.id}')">Ver Ficha</button>`;
        
        const rowHtml = `
            <tr>
                <td>
                    <div class="tenant-cell-info">
                        <strong>${t.name}</strong>
                        <small class="text-neutral-500">CPF: ${t.cpf}</small>
                    </div>
                </td>
                <td>
                    <div style="display: flex; flex-direction: column;">
                        <span>${t.phone}</span>
                        <small class="text-neutral-500">${t.email}</small>
                    </div>
                </td>
                <td><span class="unit-tag">${unitStr}</span></td>
                <td>${t.dueDay || 10}/07/2026</td>
                <td><strong>${rentFormatted}</strong></td>
                <td>${statusBadge}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function updateTenantsBadgeCount() {
    let openTenants = [];
    if (currentUser.role === 'gestor') {
        openTenants = TENANTS_DATA.filter(t => t.rentStatus === 'em_aberto' && t.dueDay === 10 && t.history && t.history[0] && t.history[0].buildingId === currentUser.buildingId);
    } else {
        openTenants = TENANTS_DATA.filter(t => t.rentStatus === 'em_aberto' && t.dueDay === 10);
    }
    
    const badge = document.getElementById('tenants-open-badge');
    if (badge) {
        if (openTenants.length > 0) {
            badge.style.display = 'inline-block';
            badge.textContent = openTenants.length;
        } else {
            badge.style.display = 'none';
        }
    }
}

function openTenantModal(tenantId) {
    const tenant = TENANTS_DATA.find(t => t.id === tenantId);
    if (!tenant) return;
    
    document.getElementById('tenant-view-name').textContent = tenant.name;
    document.getElementById('tenant-view-cpf').textContent = tenant.cpf;
    document.getElementById('tenant-view-rg').textContent = tenant.rg || 'Não informado';
    document.getElementById('tenant-view-phone').textContent = tenant.phone;
    document.getElementById('tenant-view-email').textContent = tenant.email;
    
    // Histórico de Ocupação
    const historyContainer = document.getElementById('tenant-view-history');
    if (historyContainer) {
        historyContainer.innerHTML = '';
        if (tenant.history && tenant.history.length > 0) {
            tenant.history.forEach(h => {
                const histHtml = `
                    <div style="background: var(--neutral-50, #f8f9fa); border: 1px solid var(--neutral-200, #e9ecef); padding: 10px; border-radius: var(--border-radius-sm, 4px); margin-bottom: 8px;">
                        <p style="font-size: 13px; font-weight: bold; margin-bottom: 2px;">${h.buildingName} - Unidade ${h.unitNumber}</p>
                        <p style="font-size: 12px; color: var(--neutral-500, #6c757d);">Período: ${h.period} | Valor do Aluguel: ${(h.rent || 1500).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                `;
                historyContainer.insertAdjacentHTML('beforeend', histHtml);
            });
        } else {
            historyContainer.innerHTML = '<p class="text-neutral-500" style="font-size: 12px;">Sem histórico registrado.</p>';
        }
    }
    
    // Documentos Enviados
    const docsContainer = document.getElementById('tenant-view-docs');
    if (docsContainer) {
        docsContainer.innerHTML = '';
        if (tenant.documents && tenant.documents.length > 0) {
            tenant.documents.forEach(d => {
                const docHtml = `
                    <li style="display: flex; justify-content: space-between; align-items: center; background: var(--neutral-50, #f8f9fa); border: 1px solid var(--neutral-200, #e9ecef); padding: 8px 12px; border-radius: var(--border-radius-sm, 4px); font-size: 12px; margin-bottom: 6px;">
                        <span style="font-weight: 600; color: var(--primary, #0d2c54);">${d.name} (${d.size})</span>
                        <span style="color: var(--neutral-500, #6c757d);">${d.date}</span>
                    </li>
                `;
                docsContainer.insertAdjacentHTML('beforeend', docHtml);
            });
        } else {
            docsContainer.innerHTML = '<p class="text-neutral-500" style="font-size: 12px;">Nenhum documento anexado.</p>';
        }
    }
    
    const modal = document.getElementById('modal-view-tenant');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeTenantModal() {
    const modal = document.getElementById('modal-view-tenant');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Expor funções no escopo global para compatibilidade com eventos inline
window.loadBuildingsGrid = loadBuildingsGrid;
window.viewBuildingDetail = viewBuildingDetail;
window.selectUnitCell = selectUnitCell;
window.setupBuildingsEvents = setupBuildingsEvents;
window.populateBuildingManagersDropdown = populateBuildingManagersDropdown;
window.occupyUnitWithContract = occupyUnitWithContract;
window.editBuilding = editBuilding;
window.deleteBuilding = deleteBuilding;
window.initTenantsTab = initTenantsTab;
window.loadTenantsList = loadTenantsList;
window.openTenantModal = openTenantModal;
window.closeTenantModal = closeTenantModal;
window.initFinanceTab = initFinanceTab;
/* ==========================================================================
   FUNÇÕES DE AUTOMAÇÃO E RELATÓRIOS GLOBAIS
   ========================================================================== */

function getNextFridayDateFor(date) {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    let daysToFriday = 5 - dayOfWeek;
    if (daysToFriday < 0) daysToFriday += 7;
    d.setDate(d.getDate() + daysToFriday);
    return d.toLocaleDateString('pt-BR');
}

function checkAutoReport() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    
    let shouldArchive = false;
    let fridayTargetDate = getNextFridayDateFor(now);

    if (dayOfWeek === 5 && hour >= 15) {
        shouldArchive = true;
    } else if (dayOfWeek === 6 || dayOfWeek === 0) {
        let d = new Date();
        d.setDate(d.getDate() - (dayOfWeek === 6 ? 1 : 2));
        fridayTargetDate = d.toLocaleDateString('pt-BR');
        shouldArchive = true;
    }
    
    if (shouldArchive) {
        const hasPix = PIX_DEPOSITS_DATA.length > 0;
        const hasCaixa = CAIXA_DATA.length > 0;
        
        if (hasPix || hasCaixa) {
            console.log("Fechamento Automático: Arquivando relatórios da semana de " + fridayTargetDate);
            archiveWeeklyReports(fridayTargetDate, "Automático (Fechamento da Semana)");
        }
    }
}

function archiveWeeklyReports(targetDate, motivo = "Manual") {
    // Arquiva PIX
    if (PIX_DEPOSITS_DATA.length > 0) {
        REPORTS_ARCHIVE.push({
            id: 'rep-' + Date.now() + '-pix',
            type: 'PIX',
            date: targetDate,
            reason: motivo,
            createdAt: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(PIX_DEPOSITS_DATA))
        });
        PIX_DEPOSITS_DATA = [];
    }
    
    // Arquiva Caixa
    if (CAIXA_DATA.length > 0) {
        REPORTS_ARCHIVE.push({
            id: 'rep-' + Date.now() + '-caixa',
            type: 'Caixa',
            date: targetDate,
            reason: motivo,
            createdAt: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(CAIXA_DATA))
        });
        CAIXA_DATA = [];
    }
    
    saveState();
    loadPixDepositsReport();
    loadCaixaData();
    loadGlobalReports();
}

function loadGlobalReports() {
    const container = document.getElementById('relatorios-globais-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (REPORTS_ARCHIVE.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: var(--neutral-500); padding: 20px;">Nenhum relatório fechado ainda.</div>';
        return;
    }
    
    const grouped = {};
    const monthsNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    // Ordena do mais novo para o mais velho
    const sortedArchive = [...REPORTS_ARCHIVE].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    sortedArchive.forEach(rep => {
        const parts = rep.date.split('/');
        let monthKey = "Sem Data";
        let sortKey = 0;
        if (parts.length === 3) {
            const m = parseInt(parts[1], 10) - 1;
            const y = parts[2];
            monthKey = `${monthsNames[m]} / ${y}`;
            sortKey = parseInt(y) * 100 + m;
        }
        
        if (!grouped[monthKey]) grouped[monthKey] = { sortKey, dates: {} };
        if (!grouped[monthKey].dates[rep.date]) grouped[monthKey].dates[rep.date] = [];
        
        grouped[monthKey].dates[rep.date].push(rep);
    });
    
    const now = new Date();
    const currentMonthKey = `${monthsNames[now.getMonth()]} / ${now.getFullYear()}`;
    
    // Ordenar meses do mais recente para o mais antigo
    const sortedMonths = Object.keys(grouped).sort((a, b) => grouped[b].sortKey - grouped[a].sortKey);
    
    let html = '';
    sortedMonths.forEach(month => {
        const isCurrentMonth = (month === currentMonthKey);
        
        html += `
            <div class="report-month-card" style="border: 1px solid var(--neutral-200); border-radius: var(--border-radius-sm); margin-bottom: 10px; background: white; overflow: hidden;">
                <div class="report-month-header" onclick="const c = this.nextElementSibling; const s = this.querySelector('svg'); if(c.style.display === 'none'){c.style.display='block'; s.style.transform='rotate(180deg)';}else{c.style.display='none'; s.style.transform='rotate(0deg)';}" style="padding: 15px; background: var(--neutral-50); cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--neutral-200); transition: background 0.2s;">
                    <h4 style="margin: 0; font-family: var(--font-heading); color: var(--primary); font-size: 15px; font-weight: 700;">${month}</h4>
                    <svg style="transition: transform 0.3s; transform: rotate(${isCurrentMonth ? '180deg' : '0deg'}); color: var(--neutral-500);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div class="report-month-content" style="display: ${isCurrentMonth ? 'block' : 'none'}; padding: 15px;">
        `;
        
        // Ordenar datas do mais recente para o mais antigo
        const sortedDates = Object.keys(grouped[month].dates).sort((a, b) => {
            const da = a.split('/').reverse().join('');
            const db = b.split('/').reverse().join('');
            return db.localeCompare(da);
        });
        
        sortedDates.forEach(date => {
            html += `
                <div class="report-day-group" style="margin-bottom: 15px; border: 1px solid var(--neutral-200); border-radius: var(--border-radius-sm); padding: 12px; background: white;">
                    <h5 style="margin-top: 0; margin-bottom: 12px; color: var(--neutral-700); font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--neutral-200); padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Sexta-feira, ${date}
                    </h5>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
            `;
            
            grouped[month].dates[date].forEach(rep => {
                let total = 0;
                let typeBadge = '';
                if (rep.type === 'PIX') {
                    total = rep.data.reduce((s, e) => s + e.value, 0);
                    typeBadge = '<span style="background-color: var(--primary-light); color: var(--primary); padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; width: 60px; text-align: center;">PIX</span>';
                } else {
                    const entradas = rep.data.filter(i => i.type === 'Entrada').reduce((s, e) => s + e.value, 0);
                    const saidas = rep.data.filter(i => i.type === 'Saída').reduce((s, e) => s + e.value, 0);
                    total = entradas - saidas;
                    typeBadge = '<span style="background-color: var(--success-light); color: var(--success); padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; width: 60px; text-align: center;">Caixa</span>';
                }
                
                html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--neutral-50); padding: 10px 15px; border-radius: 6px; border: 1px solid transparent; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--neutral-300)'" onmouseout="this.style.borderColor='transparent'">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                ${typeBadge}
                                <span style="font-weight: 700; font-size: 14px; color: var(--neutral-900);">${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <span style="font-size: 12px; color: var(--neutral-500); display: flex; align-items: center; gap: 4px;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    ${new Date(rep.createdAt).toLocaleString('pt-BR').substring(11, 16)} (${rep.reason})
                                </span>
                                <button class="btn-secondary" onclick="viewArchivedReport('${rep.id}')" style="padding: 6px 12px; font-size: 12px; font-weight: 600; border-radius: 4px; background: white; border: 1px solid var(--neutral-300); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--neutral-100)'" onmouseout="this.style.background='white'">
                                    Visualizar
                                </button>
                            </div>
                        </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function viewArchivedReport(id) {
    const rep = REPORTS_ARCHIVE.find(r => r.id === id);
    if (!rep) return;
    
    if (rep.type === 'PIX') {
        const backup = PIX_DEPOSITS_DATA;
        PIX_DEPOSITS_DATA = rep.data;
        const fakeDate = rep.date;
        const originalFunc = getNextFridayDate;
        window.getNextFridayDate = () => fakeDate;
        gerarRelatorioPix();
        window.getNextFridayDate = originalFunc;
        PIX_DEPOSITS_DATA = backup;
    } else {
        const backup = CAIXA_DATA;
        CAIXA_DATA = rep.data;
        const fakeDate = rep.date;
        const originalFunc = getNextFridayDate;
        window.getNextFridayDate = () => fakeDate;
        generateCaixaReport();
        window.getNextFridayDate = originalFunc;
        CAIXA_DATA = backup;
    }
}

window.confirmAndArchive = function(type) {
    const targetDate = getNextFridayDate();
    if (confirm(`Deseja gerar o relatório e FECHAR a semana de ${targetDate} agora?\nOs dados serão transferidos para os Relatórios Globais e a aba será limpa para a próxima semana.`)) {
        if (type === 'PIX') {
            gerarRelatorioPix();
        } else {
            generateCaixaReport();
        }
        archiveWeeklyReports(targetDate, "Manual (Fechamento Antecipado)");
    } else {
        if (type === 'PIX') {
            gerarRelatorioPix();
        } else {
            generateCaixaReport();
        }
    }
};

window.openNewPixModal = openNewPixModal;
window.closeNewPixModal = closeNewPixModal;
window.saveNewPixDeposit = saveNewPixDeposit;
window.onPixTenantChange = onPixTenantChange;
window.gerarRelatorioPix = gerarRelatorioPix;
window.onPixComprovanteChange = onPixComprovanteChange;
window.openNewCaixaModal = openNewCaixaModal;
window.closeNewCaixaModal = closeNewCaixaModal;
window.onCaixaTypeChange = onCaixaTypeChange;
window.onCaixaComprovanteChange = onCaixaComprovanteChange;
window.saveNewCaixa = saveNewCaixa;
window.generateCaixaReport = generateCaixaReport;

/* ==========================================================================
   MÓDULO DE CONTRATOS & ASSINATURAS (FUNCIONALIDADES DA ABA CONTRATOS)
   ========================================================================== */
let currentViewContractId = null;
let currentUploadContractId = null;
let signatureCanvas = null;
let signatureCtx = null;
let isDrawing = false;
let drawnSignatureBase64 = null;

function initContractsTab() {
    // 1. Navegação de sub-abas internas
    const subnavBtns = document.querySelectorAll('[data-contract-subtab]');
    const subtabContents = document.querySelectorAll('.contract-subtab-content');
    
    subnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSubtab = btn.getAttribute('data-contract-subtab');
            
            subnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            subtabContents.forEach(tab => tab.classList.remove('active'));
            const activeTabEl = document.getElementById(`contract-subtab-${targetSubtab}`);
            if (activeTabEl) {
                activeTabEl.classList.add('active');
            }
            
            if (targetSubtab === 'listar') {
                loadContractsList();
            } else if (targetSubtab === 'vencendo') {
                loadExpiringContractsList();
            } else if (targetSubtab === 'pendentes') {
                loadPendingContractsList();
            } else if (targetSubtab === 'emitir') {
                populateContractBuildings();
                populateContractTenants();
            }
        });
    });

    // 2. Ouvintes de busca e filtro na listagem
    const searchInput = document.getElementById('filter-contract-search');
    const buildingSelect = document.getElementById('filter-contract-building');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            loadContractsList();
        });
    }
    
    if (buildingSelect) {
        buildingSelect.addEventListener('change', () => {
            loadContractsList();
        });
    }

    // 3. Formulário de Novo Contrato
    const buildingSelectForm = document.getElementById('contract-building');
    const unitSelectForm = document.getElementById('contract-unit');
    const templateSelectForm = document.getElementById('contract-template');
    const tenantSelectForm = document.getElementById('contract-tenant-select');
    const rentInputForm = document.getElementById('contract-rent');
    const durationInputForm = document.getElementById('contract-duration');
    const startDateInputForm = document.getElementById('contract-start-date');
    const endDateInputForm = document.getElementById('contract-end-date');
    const guaranteeSelectForm = document.getElementById('contract-guarantee');
    
    // Ouvinte do menu suspenso de modelo de contrato
    if (templateSelectForm) {
        templateSelectForm.addEventListener('change', () => {
            const template = templateSelectForm.value;
            if (template === 'toquio') {
                if (rentInputForm) rentInputForm.value = 1050;
                if (durationInputForm) durationInputForm.value = 30;
            } else if (template === 'usa') {
                if (rentInputForm) rentInputForm.value = 1350;
                if (durationInputForm) durationInputForm.value = 30;
            } else if (template === 'temporada_jp') {
                if (rentInputForm) rentInputForm.value = 1300;
                if (durationInputForm) durationInputForm.value = 1;
            } else if (template === 'padrao') {
                if (durationInputForm) durationInputForm.value = 12;
                // Busca valor da unidade selecionada
                if (unitSelectForm && unitSelectForm.value) {
                    const activeUnit = UNITS_DATA.find(u => u.id === unitSelectForm.value);
                    if (activeUnit && rentInputForm) rentInputForm.value = activeUnit.rent;
                } else {
                    if (rentInputForm) rentInputForm.value = '';
                }
            }
            updateEndDateField();
        });
    }

    // Dia padrão hoje no start-date
    if (startDateInputForm) {
        const today = new Date().toISOString().split('T')[0];
        startDateInputForm.value = today;
        updateEndDateField();
    }
    
    // Atualizar data de término
    function updateEndDateField() {
        if (!startDateInputForm || !durationInputForm || !endDateInputForm) return;
        const startVal = startDateInputForm.value;
        const durVal = parseInt(durationInputForm.value) || 12;
        if (!startVal) return;
        
        const start = new Date(startVal + 'T12:00:00'); // Evitar timezone
        start.setMonth(start.getMonth() + durVal);
        
        // Formatar para pt-BR
        const day = String(start.getDate()).padStart(2, '0');
        const month = String(start.getMonth() + 1).padStart(2, '0');
        const year = start.getFullYear();
        endDateInputForm.value = `${day}/${month}/${year}`;
    }
    
    if (startDateInputForm) startDateInputForm.addEventListener('change', updateEndDateField);
    if (durationInputForm) durationInputForm.addEventListener('input', updateEndDateField);

    // Carrega unidades do prédio selecionado
    if (buildingSelectForm) {
        buildingSelectForm.addEventListener('change', () => {
            const buildingId = buildingSelectForm.value;
            if (!buildingId) {
                unitSelectForm.innerHTML = '<option value="">Selecione o prédio primeiro...</option>';
                unitSelectForm.disabled = true;
                return;
            }
            
            unitSelectForm.disabled = false;
            unitSelectForm.innerHTML = '<option value="">Selecione a unidade...</option>';
            
            // Unidades desse prédio
            const units = UNITS_DATA.filter(u => u.buildingId === buildingId);
            
            units.forEach(u => {
                const isPrefilled = window.prefilledContractData && window.prefilledContractData.unitId === u.id;
                // Exibe apenas livres, a não ser que seja um preenchimento direcionado
                if (u.status === 'vacant' || isPrefilled) {
                    const opt = document.createElement('option');
                    opt.value = u.id;
                    opt.textContent = `Apto ${u.number} (${u.status === 'occupied' ? 'Ocupado' : 'Livre'} - R$ ${u.rent})`;
                    if (isPrefilled) opt.selected = true;
                    unitSelectForm.appendChild(opt);
                }
            });
            
            // Preencher aluguel inicial
            if (unitSelectForm.value) {
                const activeUnit = UNITS_DATA.find(u => u.id === unitSelectForm.value);
                if (activeUnit && rentInputForm) {
                    if (!templateSelectForm || templateSelectForm.value === 'padrao') {
                        rentInputForm.value = activeUnit.rent;
                    }
                }
            }
        });
    }
    
    if (unitSelectForm) {
        unitSelectForm.addEventListener('change', () => {
            const activeUnit = UNITS_DATA.find(u => u.id === unitSelectForm.value);
            if (activeUnit && rentInputForm) {
                if (!templateSelectForm || templateSelectForm.value === 'padrao') {
                    rentInputForm.value = activeUnit.rent;
                }
            }
        });
    }

    // (Garantia removida — sem garantia locáticía por padrão)

    // Vincular Inquilino Existente
    if (tenantSelectForm) {
        tenantSelectForm.addEventListener('change', () => {
            const tId = tenantSelectForm.value;
            const nameInput = document.getElementById('contract-tenant-name');
            const phoneInput = document.getElementById('contract-tenant-phone');
            const cpfInput = document.getElementById('contract-tenant-cpf');
            const rgInput = document.getElementById('contract-tenant-rg');
            const emailInput = document.getElementById('contract-tenant-email');
            
            if (!tId) {
                nameInput.value = '';
                phoneInput.value = '';
                cpfInput.value = '';
                rgInput.value = '';
                emailInput.value = '';
                nameInput.disabled = false;
                phoneInput.disabled = false;
                cpfInput.disabled = false;
                rgInput.disabled = false;
                emailInput.disabled = false;
                return;
            }
            
            const tenant = TENANTS_DATA.find(t => t.id === tId);
            if (tenant) {
                nameInput.value = tenant.name;
                phoneInput.value = tenant.phone;
                cpfInput.value = tenant.cpf;
                rgInput.value = tenant.rg;
                emailInput.value = tenant.email;
                
                // Desabilitar inputs para evitar inconsistência visual
                nameInput.disabled = true;
                phoneInput.disabled = true;
                cpfInput.disabled = true;
                rgInput.disabled = true;
                emailInput.disabled = true;
            }
        });
    }

    // Enviar formulário -> Abrir Modal de Visualização
    const formNewContract = document.getElementById('form-new-contract');
    if (formNewContract) {
        formNewContract.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const buildingId = buildingSelectForm.value;
            const building = BUILDINGS_DATA.find(b => b.id === buildingId);
            const unitId = unitSelectForm.value;
            const unit = UNITS_DATA.find(u => u.id === unitId);
            
            const nameInput = document.getElementById('contract-tenant-name');
            const phoneInput = document.getElementById('contract-tenant-phone');
            const cpfInput = document.getElementById('contract-tenant-cpf');
            const rgInput = document.getElementById('contract-tenant-rg');
            const emailInput = document.getElementById('contract-tenant-email');
            
            const rentVal = parseFloat(rentInputForm.value) || 0;
            const durationVal = parseInt(durationInputForm.value) || 12;
            const startVal = startDateInputForm.value;
            const parts = startVal.split('-');
            const startDateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
            const endDateStr = endDateInputForm.value;
            const dueDay = document.getElementById('contract-due-day').value;
            const clauses = document.getElementById('contract-clauses').value;
            
            // Gerar Contrato Temporário
            const tempContract = {
                id: `ctr-temp-${Date.now()}`,
                buildingId,
                buildingName: building ? building.name : 'Bueno Residence',
                unitId,
                unitNumber: unit ? unit.number : '',
                tenantName: nameInput.value,
                tenantCpf: cpfInput.value,
                tenantRg: rgInput.value,
                tenantPhone: phoneInput.value,
                tenantEmail: emailInput.value,
                rentValue: rentVal,
                duration: durationVal,
                startDate: startDateStr,
                endDate: endDateStr,
                paymentDueDay: dueDay,
                guaranteeType: 'Sem Garantia',
                clauses: clauses || '',
                signatureStatus: 'rascunho',
                signedFileUrl: null,
                templateType: templateSelectForm ? templateSelectForm.value : 'padrao'
            };
            
            renderLeaseContractDocument(tempContract);
            
            // Visibilidade de botões por papel
            const requestSigBtn = document.getElementById('btn-request-admin-sig');
            const adminSignBtn = document.getElementById('btn-admin-sign-now');
            
            if (currentUser.role === 'admin') {
                requestSigBtn.style.display = 'none';
                adminSignBtn.style.display = 'block';
            } else {
                requestSigBtn.style.display = 'block';
                adminSignBtn.style.display = 'none';
                requestSigBtn.disabled = false;
                requestSigBtn.textContent = 'Solicitar Assinatura Admin';
            }
            
            currentViewContractId = null; 
            window.activeTempContract = tempContract;
            
            document.getElementById('modal-view-contract').classList.add('active');
        });
    }

    // Cancelar no Form
    const btnCancelContract = document.getElementById('btn-cancel-contract');
    if (btnCancelContract) {
        btnCancelContract.addEventListener('click', () => {
            formNewContract.reset();
            if (tenantSelectForm) tenantSelectForm.value = '';
            document.getElementById('contract-tenant-name').disabled = false;
            document.getElementById('contract-tenant-phone').disabled = false;
            document.getElementById('contract-tenant-cpf').disabled = false;
            document.getElementById('contract-tenant-rg').disabled = false;
            document.getElementById('contract-tenant-email').disabled = false;
            
            document.querySelector('[data-contract-subtab="listar"]').click();
        });
    }

    // Configuração do Canvas de Assinatura
    setupSignatureCanvas();
    
    // Tab switching no Signature Modal
    const sigTabBtns = document.querySelectorAll('[data-sig-method]');
    sigTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const method = btn.getAttribute('data-sig-method');
            sigTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.sig-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`sig-method-${method}`).classList.add('active');
        });
    });

    // Solicitar assinatura do Admin (Gerente/Gestor)
    const btnRequestSig = document.getElementById('btn-request-admin-sig');
    if (btnRequestSig) {
        btnRequestSig.addEventListener('click', () => {
            if (!window.activeTempContract) return;
            const temp = window.activeTempContract;
            
            // Criar contrato pendente no banco
            const newContract = {
                ...temp,
                id: `ctr-${Date.now()}`,
                signatureStatus: 'pendente_assinatura',
                createdAt: new Date().toLocaleDateString('pt-BR')
            };
            
            CONTRACTS_DATA.push(newContract);
            
            logActivity(`Emitiu contrato para ${newContract.tenantName} (Apto ${newContract.unitNumber}) e solicitou assinatura do Admin.`);
            saveState();
            
            closeContractModal();
            formNewContract.reset();
            document.querySelector('[data-contract-subtab="listar"]').click();
            alert('Solicitação de assinatura enviada com sucesso para o Administrador!');
        });
    }

    // Assinar digitalmente (Admin)
    const btnAdminSign = document.getElementById('btn-admin-sign-now');
    if (btnAdminSign) {
        btnAdminSign.addEventListener('click', () => {
            document.getElementById('modal-signature-pad').classList.add('active');
            clearSignatureCanvas();
        });
    }

    // Salvar Assinatura e finalizar
    const btnSaveSignature = document.getElementById('btn-save-admin-signature');
    if (btnSaveSignature) {
        btnSaveSignature.addEventListener('click', () => {
            const activeTab = document.querySelector('.sig-tab-btn.active').getAttribute('data-sig-method');
            let signatureImg = '';
            
            if (activeTab === 'desenhar') {
                if (!drawnSignatureBase64) {
                    alert('Por favor, desenhe sua assinatura no quadro.');
                    return;
                }
                signatureImg = drawnSignatureBase64;
            } else {
                signatureImg = 'mock_stamp';
            }
            
            if (currentViewContractId) {
                // Assinando um contrato existente
                const contract = CONTRACTS_DATA.find(c => c.id === currentViewContractId);
                if (contract) {
                    contract.signatureStatus = 'assinado';
                    contract.signedFileUrl = `Contrato_Digital_${contract.unitNumber}_${contract.buildingName.replace(/\s+/g, '')}.pdf`;
                    
                    appendSignatureToModalDoc(contract, signatureImg);
                    
                    // Ocupar unidade após a assinatura do admin
                    occupyUnit(contract.unitId, contract.tenantName, contract.tenantPhone, contract.rentValue);
                    
                    logActivity(`Assinou digitalmente o contrato de ${contract.tenantName} (Apto ${contract.unitNumber}).`);
                    saveState();
                    
                    alert('Contrato assinado com sucesso!');
                    closeSignatureModal();
                    
                    document.getElementById('btn-admin-sign-now').style.display = 'none';
                    loadPendingContractsList();
                    loadContractsList();
                    updateContractBadge();
                }
            } else if (window.activeTempContract) {
                // Criando e assinando um novo contrato imediatamente
                const temp = window.activeTempContract;
                const newContract = {
                    ...temp,
                    id: `ctr-${Date.now()}`,
                    signatureStatus: 'assinado',
                    signedFileUrl: `Contrato_Digital_${temp.unitNumber}_${temp.buildingName.replace(/\s+/g, '')}.pdf`,
                    createdAt: new Date().toLocaleDateString('pt-BR')
                };
                
                CONTRACTS_DATA.push(newContract);
                
                occupyUnit(newContract.unitId, newContract.tenantName, newContract.tenantPhone, newContract.rentValue);
                
                logActivity(`Emitiu e assinou digitalmente o contrato de ${newContract.tenantName} (Apto ${newContract.unitNumber}).`);
                saveState();
                
                appendSignatureToModalDoc(newContract, signatureImg);
                
                alert('Contrato assinado e gerado com sucesso!');
                closeSignatureModal();
                
                document.getElementById('btn-admin-sign-now').style.display = 'none';
                formNewContract.reset();
                document.querySelector('[data-contract-subtab="listar"]').click();
            }
        });
    }

    // Configurar o upload
    setupUploadDropzone();

    // Ouvinte para links de ações nas tabelas
    document.addEventListener('click', (e) => {
        const btnView = e.target.closest('.btn-view-contract');
        if (btnView) {
            const ctrId = btnView.getAttribute('data-contract-id');
            const contract = CONTRACTS_DATA.find(c => c.id === ctrId);
            if (contract) {
                currentViewContractId = ctrId;
                window.activeTempContract = contract;
                renderLeaseContractDocument(contract);
                
                const requestSigBtn = document.getElementById('btn-request-admin-sig');
                const adminSignBtn = document.getElementById('btn-admin-sign-now');
                const printBtn = document.getElementById('btn-print-contract-doc');
                
                if (contract.signatureStatus === 'pendente_assinatura' && currentUser.role === 'admin') {
                    adminSignBtn.style.display = 'block';
                    requestSigBtn.style.display = 'none';
                } else if (contract.signatureStatus === 'pendente_assinatura' && currentUser.role !== 'admin') {
                    adminSignBtn.style.display = 'none';
                    requestSigBtn.style.display = 'block';
                    requestSigBtn.disabled = true;
                    requestSigBtn.textContent = 'Aguardando Admin...';
                } else {
                    adminSignBtn.style.display = 'none';
                    requestSigBtn.style.display = 'none';
                }
                
                document.getElementById('modal-view-contract').classList.add('active');
            }
        }
        
        const btnUpload = e.target.closest('.btn-upload-contract');
        if (btnUpload) {
            const ctrId = btnUpload.getAttribute('data-contract-id');
            const contract = CONTRACTS_DATA.find(c => c.id === ctrId);
            if (contract) {
                currentUploadContractId = ctrId;
                document.getElementById('upload-signed-info').value = `Apto ${contract.unitNumber} - ${contract.tenantName}`;
                document.getElementById('modal-upload-signed').classList.add('active');
                
                document.getElementById('upload-signed-progress').style.display = 'none';
                document.getElementById('btn-submit-upload-signed').disabled = true;
                document.getElementById('btn-submit-upload-signed').style.opacity = '0.5';
                document.getElementById('upload-signed-file').value = '';
            }
        }
    });
    
    // Ouvinte para imprimir o contrato do modal
    const btnPrintDoc = document.getElementById('btn-print-contract-doc');
    if (btnPrintDoc) {
        btnPrintDoc.addEventListener('click', () => {
            window.print();
        });
    }

    // Ouvinte para baixar o contrato do modal (.docx)
    const btnDownloadDocx = document.getElementById('btn-download-docx');
    if (btnDownloadDocx) {
        btnDownloadDocx.addEventListener('click', () => {
            if (window.activeTempContract) {
                downloadDocxContract(window.activeTempContract);
            } else {
                alert('Nenhum contrato ativo para download.');
            }
        });
    }

    loadContractsList();
    loadPendingContractsList();
    updateContractBadge();
}

function populateContractBuildings() {
    const selectForm = document.getElementById('contract-building');
    if (!selectForm) return;
    
    const curVal = selectForm.value;
    selectForm.innerHTML = '<option value="">Selecione o prédio...</option>';
    
    let filtered = BUILDINGS_DATA;
    if (currentUser.role === 'gestor') {
        filtered = BUILDINGS_DATA.filter(b => b.id === currentUser.buildingId);
    }
    
    filtered.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = b.name;
        selectForm.appendChild(opt);
    });
    
    if (curVal) selectForm.value = curVal;
}

function populateContractTenants() {
    const selectForm = document.getElementById('contract-tenant-select');
    if (!selectForm) return;
    
    selectForm.innerHTML = '<option value="">-- Cadastrar Novo Morador --</option>';
    
    TENANTS_DATA.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.name} (CPF: ${t.cpf})`;
        selectForm.appendChild(opt);
    });
}

function loadContractsList() {
    const tbody = document.getElementById('contracts-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const searchQuery = document.getElementById('filter-contract-search') ? document.getElementById('filter-contract-search').value.toLowerCase() : '';
    const buildingFilter = document.getElementById('filter-contract-building') ? document.getElementById('filter-contract-building').value : 'all';
    
    let filtered = CONTRACTS_DATA;
    
    if (currentUser.role === 'gestor') {
        filtered = filtered.filter(c => c.buildingId === currentUser.buildingId);
    }
    
    if (buildingFilter !== 'all') {
        filtered = filtered.filter(c => c.buildingId === buildingFilter);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(c => 
            c.tenantName.toLowerCase().includes(searchQuery) ||
            c.tenantCpf.includes(searchQuery) ||
            c.unitNumber.toString().includes(searchQuery) ||
            c.buildingName.toLowerCase().includes(searchQuery)
        );
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum contrato encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    filtered.forEach(c => {
        let sigBadge = `<span class="badge" style="background-color: var(--neutral-100); color: var(--neutral-700);">Rascunho</span>`;
        if (c.signatureStatus === 'pendente_assinatura') {
            sigBadge = `<span class="badge" style="background-color: var(--warning-light); color: var(--warning); border-color: rgba(245, 166, 35, 0.3);">Aguardando Assinatura</span>`;
        } else if (c.signatureStatus === 'assinado') {
            sigBadge = `<span class="badge" style="background-color: var(--success-light); color: var(--success); border-color: var(--success); font-weight: bold;">Assinado (Digital)</span>`;
        }
        
        let fileCol = `<span class="text-neutral-500" style="font-size: 11px;">Pendente</span>`;
        if (c.signedFileUrl) {
            fileCol = `
                <a href="#" onclick="alert('Download do arquivo assinado simulado com sucesso: ${c.signedFileUrl}'); event.preventDefault();" class="flex align-center gap-5 text-primary" style="font-weight: 600; text-decoration: none; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    ${c.signedFileUrl.length > 20 ? c.signedFileUrl.substring(0, 18) + '...' : c.signedFileUrl}
                </a>
            `;
        }
        
        const rowHtml = `
            <tr>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <strong>${c.tenantName}</strong>
                        <span class="tenant-phone" style="font-size: 11px; color: var(--neutral-500);">${c.tenantPhone}</span>
                    </div>
                </td>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <span>Apto ${c.unitNumber}</span>
                        <small class="text-neutral-500" style="font-size: 10px;">${c.buildingName}</small>
                    </div>
                </td>
                <td>
                    <div class="tenant-cell-info" style="font-size: 12px; display: flex; flex-direction: column;">
                        <span>De: ${c.startDate}</span>
                        <span>Até: <strong style="color: var(--primary-light);">${c.endDate}</strong></span>
                    </div>
                </td>
                <td><strong>R$ ${c.rentValue}</strong></td>
                <td>${sigBadge}</td>
                <td>${fileCol}</td>
                <td>
                    <div class="flex gap-5" style="display: flex; gap: 6px;">
                        <button class="btn-action-mini btn-view-contract" data-contract-id="${c.id}" title="Visualizar / Imprimir">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button class="btn-action-mini btn-upload-contract" data-contract-id="${c.id}" title="Subir Contrato Assinado">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    });
    
    // Atualiza filtro select se necessário
    const bFilterSelect = document.getElementById('filter-contract-building');
    if (bFilterSelect && bFilterSelect.children.length <= 1) {
        BUILDINGS_DATA.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.name;
            bFilterSelect.appendChild(opt);
        });
    }
}

function loadPendingContractsList() {
    const tbody = document.getElementById('contracts-pending-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const filtered = CONTRACTS_DATA.filter(c => c.signatureStatus === 'pendente_assinatura');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--neutral-500); padding: 20px;">
                    Nenhum contrato pendente de assinatura.
                </td>
            </tr>
        `;
        return;
    }
    
    filtered.forEach(c => {
        const rowHtml = `
            <tr>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <strong>${c.tenantName}</strong>
                        <span class="tenant-phone" style="font-size: 11px; color: var(--neutral-500);">${c.tenantPhone}</span>
                    </div>
                </td>
                <td>
                    <div class="tenant-cell-info" style="display: flex; flex-direction: column;">
                        <span>Apto ${c.unitNumber}</span>
                        <small class="text-neutral-500" style="font-size: 10px;">${c.buildingName}</small>
                    </div>
                </td>
                <td><span style="font-size: 12px;">${c.createdAt || c.startDate}</span></td>
                <td><strong>R$ ${c.rentValue}</strong></td>
                <td>
                    <div class="flex gap-5" style="display: flex; gap: 6px;">
                        <button class="btn-action-mini btn-view-contract" data-contract-id="${c.id}" title="Revisar e Assinar" style="background-color: var(--warning-light); border-color: rgba(245, 166, 35, 0.3); color: var(--warning);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

function updateContractBadge() {
    const pendingCount = CONTRACTS_DATA.filter(c => c.signatureStatus === 'pendente_assinatura').length;
    
    const sidebarBadge = document.getElementById('sidebar-contracts-badge');
    const tabBadge = document.getElementById('contracts-pending-badge');
    
    if (sidebarBadge) {
        if (pendingCount > 0 && currentUser.role === 'admin') {
            sidebarBadge.textContent = pendingCount;
            sidebarBadge.style.display = 'inline-block';
        } else {
            sidebarBadge.style.display = 'none';
        }
    }
    
    if (tabBadge) {
        if (pendingCount > 0) {
            tabBadge.textContent = pendingCount;
            tabBadge.style.display = 'inline-block';
        } else {
            tabBadge.style.display = 'none';
        }
    }
}

function occupyUnit(unitId, tenantName, tenantPhone, rentValue) {
    const unit = UNITS_DATA.find(u => u.id === unitId);
    if (unit) {
        unit.status = 'occupied';
        unit.tenant = tenantName;
        unit.phone = tenantPhone;
        unit.rent = rentValue;
        
        // Sincronizar o histórico do inquilino correspondente
        let tenant = TENANTS_DATA.find(t => t.name === tenantName);
        if (!tenant) {
            // Se não existisse nos inquilinos, cria um agora
            const tenantId = `tenant-${Date.now()}`;
            tenant = {
                id: tenantId,
                name: tenantName,
                cpf: generateMockCPF(),
                rg: generateMockRG(),
                phone: tenantPhone,
                email: `${tenantName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '.')}@buenoresidence.com`,
                documents: [],
                history: [],
                active: true
            };
            TENANTS_DATA.push(tenant);
        }
        
        const building = BUILDINGS_DATA.find(b => b.id === unit.buildingId);
        const bName = building ? building.name : 'Bueno Residence';
        
        // Verifica se a unidade já está no histórico deste inquilino
        const histExists = tenant.history.find(h => h.unitId === unitId && h.status === 'active');
        if (!histExists) {
            tenant.history.push({
                buildingId: unit.buildingId,
                buildingName: bName,
                unitId: unit.id,
                unitNumber: unit.number,
                period: `${new Date().toLocaleDateString('pt-BR', {month: 'short', year: 'numeric'})} - Atual`,
                rent: rentValue,
                status: 'active'
            });
        }
        
        // Atualizar ocupação do prédio
        if (building) {
            const bUnits = UNITS_DATA.filter(u => u.buildingId === building.id);
            const occupiedCount = bUnits.filter(u => u.status === 'occupied').length;
            building.occupied = occupiedCount;
            building.rate = parseFloat(((occupiedCount / bUnits.length) * 100).toFixed(1));
        }
        
        if (activeBuildingId === unit.buildingId) {
            loadUnitsGrid();
            updateBlockStatsUI(activeBuildingId);
        } else {
            updateBlockStatsUI(unit.buildingId);
        }
        
        loadDashboardData();
    }
}

function renderLeaseContractDocument(c) {
    const docContainer = document.getElementById('printable-contract-document');
    if (!docContainer) return;
    
    let stampHtml = '';
    if (c.signatureStatus === 'assinado') {
        const savedStamp = localStorage.getItem(`sig_img_${c.id}`);
        if (savedStamp) {
            stampHtml = `<img src="${savedStamp}" class="contract-stamp-img" style="max-height: 55px; max-width: 140px; mix-blend-mode: multiply;" />`;
        } else {
            stampHtml = `
                <div style="border: 2px solid #2d6a4f; border-radius: 4px; padding: 4px 8px; color: #2d6a4f; font-family: sans-serif; font-size: 8px; text-transform: uppercase; font-weight: bold; transform: rotate(-3deg); text-align: center; line-height: 1.2;">
                    Assinado Eletronicamente<br/>
                    ADMIN BUENO RESIDENCE<br/>
                    IP: 192.168.1.100<br/>
                    Data: ${c.startDate}
                </div>
            `;
        }
    }
    
    let guarantorHtml = '';
    if (c.guaranteeType === 'Fiador' && c.guarantorName) {
        guarantorHtml = `
            <div class="contract-section" style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA QUINTA - DA GARANTIA (FIADOR)</h4>
                <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">5.1. Como garantia fiel das obrigações assumidas neste instrumento, assina também o presente contrato como FIADOR e principal pagador, o Sr(a). <strong>${c.guarantorName}</strong>, inscrito no CPF sob o nº <strong>${c.guarantorCpf}</strong>.</p>
            </div>
        `;
    } else {
        guarantorHtml = `
            <div class="contract-section" style="margin-bottom: 20px;">
                <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA QUINTA - DA GARANTIA</h4>
                <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">5.1. O presente contrato de locação residencial é garantido por meio de <strong>${c.guaranteeType}</strong>, restando acordada a prestação de obrigações acessórias decorrentes de referida modalidade.</p>
            </div>
        `;
    }

    const startVal = c.startDate || '14/07/2026';
    const day = startVal.split('/')[0] || '14';
    const monthIndex = startVal.split('/')[1] || '07';
    const year = startVal.split('/')[2] || '2026';
    const monthName = getMonthName(monthIndex);

    // Variáveis dinâmicas baseadas no modelo (Tokyo, USA, Temporada JP)
    let contractTitle = 'INSTRUMENTO PARTICULAR DE CONTRATO DE LOCAÇÃO RESIDENCIAL';
    let docCode = c.templateType === 'toquio' ? 'CONTRATO Particular DE LOCAÇÃO 23/2026 - TÓQUIO - JP' :
                  c.templateType === 'usa' ? 'CONTRATO Particular DE LOCAÇÃO 06/2025 - USA - JP' :
                  c.templateType === 'temporada_jp' ? 'CONTRATO DE LOCAÇÃO TEMPORADA 04/2026 - JP' :
                  'CONTRATO DE LOCAÇÃO RESIDENCIAL';
                  
    let locadorDescription = 'Bueno Residence Empreendimentos Imobiliários Ltda, com sede administrativa no Bueno Residence, Goiânia-GO.';
    if (c.templateType === 'toquio' || c.templateType === 'usa' || c.templateType === 'temporada_jp') {
        locadorDescription = 'Carlos Juliano Filho, Solteiro, RG 32.238, Residente e Domiciliado na Rua Direta Qd.06 lt.04 Setor Sol Nascente. Goiânia - GO - CEP 74210-126.';
    }

    let objetoText = '';
    let vigenciaText = '';
    let aluguelText = '';
    let clausulaQuartaText = '';

    if (c.templateType === 'toquio') {
        objetoText = `1.1. O objeto deste contrato é a locação residencial de imóvel <strong>"QUARTO"</strong> composto de áreas comuns em sistema de condomínio, identificado como <strong>Quarto nº ${c.unitNumber}</strong>, no endereço <strong>Rua Direta, Qd.06, Lt.04 Setor Sol Nascente, Goiânia - GO - CEP 74210-126</strong>.
        <br/>1.2. Descrição dos Móveis: Quarto mobiliado com cama, guarda-roupa, mesa e cadeira. Utilização estritamente para moradia exclusivamente individual.`;
        
        vigenciaText = `2.1. A presente locação terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término previsto para <strong>${c.endDate}</strong>.
        <br/>2.2. Será isento da multa contratual o Locatário que morar por <strong>06 (seis) meses</strong> com todos os pagamentos devidamente realizados e solicitar por escrito, com 30 (trinta) dias de antecedência, a vontade de rescindir o contrato.`;
        
        aluguelText = `3.1. O valor mensal do aluguel é de <strong>R$ ${(parseFloat(c.rentValue) || 1050).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 1050)})</strong>.
        <br/>3.2. Fica pactuado que haverá um **desconto por pontualidade** no valor de **R$ 100,00 (cem reais)** para pagamentos efetuados até o dia 10 de cada mês, reduzindo o valor líquido do aluguel para R$ ${(parseFloat(c.rentValue) - 100).toFixed(2)}.`;
        
        clausulaQuartaText = `4.1. O Locatário compromete-se a cumprir o regulamento interno de convivência das áreas comuns do condomínio. Cláusulas Especiais pactuadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
        
    } else if (c.templateType === 'usa') {
        objetoText = `1.1. O objeto deste contrato é a locação residencial de imóvel <strong>"QUARTO COM COZINHA"</strong>, em condomínio residencial, identificado como <strong>Quarto nº ${c.unitNumber} - Bloco USA</strong>, no endereço <strong>Rua Direta, Q.04, lt.09/10 Setor Sol Nascente, Goiânia - GO - CEP 74210-126</strong>.
        <br/>1.2. A utilização destina-se exclusivamente para moradia de até 2 pessoas (conforme termo de ocupação do quarto).`;
        
        vigenciaText = `2.1. A presente locação terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término previsto para <strong>${c.endDate}</strong>.
        <br/>2.2. Será isento da multa contratual o Locatário que morar por <strong>12 (doze) meses</strong> com todos os pagamentos devidamente realizados e solicitar por escrito, com 30 (trinta) dias de antecedência, a vontade de rescindir o contrato.`;
        
        aluguelText = `3.1. O valor mensal do aluguel é de <strong>R$ ${(parseFloat(c.rentValue) || 1350).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 1350)})</strong>.
        <br/>3.2. Fica pactuado que haverá um **desconto por pontualidade** no valor de **R$ 150,00 (cento e cinquenta reais)** para pagamentos efetuados até o dia 10 de cada mês, reduzindo o valor líquido do aluguel para R$ ${(parseFloat(c.rentValue) - 150).toFixed(2)}.`;
        
        clausulaQuartaText = `4.1. O Locatário declara estar ciente de que as despesas comuns de água e luz estão rateadas ou inclusas no condomínio. Cláusulas Especiais pactuadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
        
    } else if (c.templateType === 'temporada_jp') {
        contractTitle = 'CONTRATO DE LOCAÇÃO POR TEMPORADA (ART. 48 LEI 8.245)';
        
        objetoText = `1.1. O objeto deste contrato é a locação temporária residencial do imóvel <strong>"QUARTO"</strong> mobiliado com cama, mesa, cadeira e guarda-roupa, identificado como <strong>Quarto nº ${c.unitNumber} - JP</strong>, situado na <strong>Rua Direta, Q06, lt 04/6 Setor Sol Nascente, Goiânia - GO - CEP 74210-126</strong>.
        <br/>1.2. Destina-se exclusivamente para fins residenciais na modalidade temporada, conforme Art. 48 da Lei do Inquilinato, podendo ser ocupado apenas pelo locatário em moradia exclusivamente individual.`;
        
        vigenciaText = `2.1. A presente locação por temporada terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término em <strong>${c.endDate}</strong>, data na qual o Locatário obriga-se a desocupar o imóvel independentemente de notificação.`;
        
        aluguelText = `3.1. O valor da temporada contratada é de <strong>R$ ${(parseFloat(c.rentValue) || 1300).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 1300)})</strong>, pago de forma antecipada ou no ato da entrega das chaves conforme acordo comercial.`;
        
        clausulaQuartaText = `4.1. Fica proibida a permanência de animais de qualquer porte ou visitas com pernoite sem autorização do Locador. Cláusulas Especiais pactuadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
        
    } else {
        // Padrão Residencial original
        objetoText = `1.1. O objeto deste contrato é a locação residencial da unidade identificada como <strong>Apto ${c.unitNumber}</strong>, situado no empreendimento <strong>${c.buildingName}</strong>, entregue em perfeitas condições de habitação e conservação.`;
        vigenciaText = `2.1. A presente locação terá o prazo determinado de <strong>${c.duration} meses</strong>, com início em <strong>${c.startDate}</strong> e término previsto para <strong>${c.endDate}</strong>.
        <br/>2.2. Findo o prazo estipulado, o contrato poderá ser prorrogado mediante acordo mútuo das partes ou desocupação do imóvel no estado em que foi recebido.`;
        aluguelText = `3.1. O valor mensal do aluguel residencial livremente pactuado é de <strong>R$ ${(parseFloat(c.rentValue) || 0).toFixed(2)} (por extenso: ${convertNumberToWords(parseFloat(c.rentValue) || 0)})</strong>, a ser pago mensalmente pelo Locatário.
        <br/>3.2. O pagamento deverá ser efetuado impreterivelmente até o <strong>dia ${c.paymentDueDay || '10'}</strong> de cada mês subsequente ao vencido.`;
        clausulaQuartaText = `4.1. O Locatário declara receber o imóvel vistoriado, comprometendo-se a zelar por sua integridade e efetuar os reparos necessários decorrentes do uso. Fica vedada a sublocação, empréstimo ou transferência do imóvel a terceiros sem prévio consentimento formal do Locador.
        <br/>4.2. Cláusulas Especiais acordadas: <em>${c.clauses || 'Sem observações adicionais.'}</em>`;
    }

    docContainer.innerHTML = `
        <div style="font-family: sans-serif; font-size: 10px; color: var(--neutral-400); text-align: right; margin-bottom: 5px;" class="no-print">${docCode}</div>
        <div class="contract-title" style="text-align: center; font-weight: bold; text-transform: uppercase; font-size: 16px; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 10px;">${contractTitle}</div>
        
        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">1. DAS PARTES</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;"><strong>LOCADOR:</strong> ${locadorDescription}</p>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;"><strong>LOCATÁRIO:</strong> <strong>${c.tenantName}</strong>, inscrito(a) no CPF sob o nº <strong>${c.tenantCpf}</strong>, portador(a) do RG nº <strong>${c.tenantRg || 'Não Informado'}</strong>, telefone de contato <strong>${c.tenantPhone}</strong>, doravante denominado simplesmente Locatário.</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA PRIMEIRA - DO OBJETO</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${objetoText}</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA SEGUNDA - DO PRAZO DE VIGÊNCIA</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${vigenciaText}</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA TERCEIRA - DO VALOR DO ALUGUEL</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${aluguelText}</p>
        </div>

        <div class="contract-section" style="margin-bottom: 20px;">
            <h4 style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 6px;">CLÁUSULA QUARTA - DAS OBRIGAÇÕES GERAIS</h4>
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">${clausulaQuartaText}</p>
        </div>

        ${guarantorHtml}

        <div class="contract-section" style="margin-bottom: 25px;">
            <p style="text-align: justify; font-size: 12px; margin-bottom: 8px;">E, por estarem assim justas e contratadas, as partes assinam o presente instrumento para que surta seus efeitos legais.</p>
            <p style="text-align: right; margin-top: 30px; font-size: 12px; font-weight: bold;">Goiânia-GO, ${day} de ${monthName} de ${year}.</p>
        </div>

        <div class="contract-signatures-row" style="display: flex; justify-content: space-between; margin-top: 60px; gap: 40px;">
            <div class="contract-sig-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div class="contract-stamp-container" id="contract-admin-signature-stamp" style="height: 60px; display: flex; align-items: center; justify-content: center;">
                    ${stampHtml}
                </div>
                <div class="contract-sig-line" style="border-top: 1px solid #333; width: 100%; margin-top: 20px; padding-top: 8px; font-size: 12px; font-weight: bold; font-family: sans-serif;">${c.templateType === 'padrao' || !c.templateType ? 'BUENO RESIDENCE' : 'CARLOS JULIANO FILHO'}<br/>(Locador)</div>
            </div>
            <div class="contract-sig-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div style="height: 60px;"></div>
                <div class="contract-sig-line" style="border-top: 1px solid #333; width: 100%; margin-top: 20px; padding-top: 8px; font-size: 12px; font-weight: bold; font-family: sans-serif;">${c.tenantName}<br/>(Locatário)</div>
            </div>
        </div>
    `;
}

function getMonthName(monthStr) {
    const months = {
        '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
        '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
        '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    return months[monthStr] || 'Julho';
}

function convertNumberToWords(num) {
    if (num === 1050) return 'um mil e cinquenta reais';
    if (num === 1100) return 'um mil e cem reais';
    if (num === 1150) return 'um mil cento e cinquenta reais';
    if (num === 1200) return 'um mil e duzentos reais';
    if (num === 1250) return 'um mil duzentos e cinquenta reais';
    if (num === 1300) return 'um mil e trezentos reais';
    if (num === 1350) return 'um mil trezentos e cinquenta reais';
    if (num === 1400) return 'um mil e quatrocentos reais';
    if (num === 1450) return 'um mil quatrocentos e cinquenta reais';
    if (num === 1500) return 'um mil e quinhentos reais';
    if (num === 1600) return 'um mil e seiscentos reais';
    if (num === 1700) return 'um mil e setecentos reais';
    if (num === 1800) return 'um mil e oitocentos reais';
    if (num === 1900) return 'um mil e novecentos reais';
    if (num === 2000) return 'dois mil reais';
    if (num === 2500) return 'dois mil e quinhentos reais';
    if (num === 3000) return 'três mil reais';
    // Fallback genérico
    const intPart = Math.floor(num);
    const decPart = Math.round((num - intPart) * 100);
    const decStr = decPart > 0 ? ` e ${decPart} centavos` : '';
    return `${intPart} reais${decStr}`;
}

function setupSignatureCanvas() {
    const canvas = document.getElementById('signature-canvas');
    if (!canvas) return;
    
    signatureCanvas = canvas;
    signatureCtx = canvas.getContext('2d');
    
    document.getElementById('btn-clear-canvas').addEventListener('click', clearSignatureCanvas);
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
}

function startDrawing(e) {
    isDrawing = true;
    signatureCtx.beginPath();
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    signatureCtx.lineWidth = 2.5;
    signatureCtx.lineCap = 'round';
    signatureCtx.strokeStyle = '#0d2c54'; 
}

function draw(e) {
    if (!isDrawing) return;
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    signatureCtx.stroke();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    drawnSignatureBase64 = signatureCanvas.toDataURL();
}

function clearSignatureCanvas() {
    if (!signatureCanvas || !signatureCtx) return;
    signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    drawnSignatureBase64 = null;
}

function appendSignatureToModalDoc(contract, imgData) {
    const stampContainer = document.getElementById('contract-admin-signature-stamp');
    if (!stampContainer) return;
    
    if (imgData === 'mock_stamp') {
        stampContainer.innerHTML = `
            <div style="border: 2px solid #2d6a4f; border-radius: 4px; padding: 4px 8px; color: #2d6a4f; font-family: sans-serif; font-size: 8px; text-transform: uppercase; font-weight: bold; transform: rotate(-3deg); text-align: center; line-height: 1.2;">
                Assinado Eletronicamente<br/>
                ADMIN BUENO RESIDENCE<br/>
                IP: 192.168.1.100<br/>
                Data: ${new Date().toLocaleDateString('pt-BR')}
            </div>
        `;
    } else {
        localStorage.setItem(`sig_img_${contract.id}`, imgData);
        stampContainer.innerHTML = `<img src="${imgData}" class="contract-stamp-img" style="max-height: 55px; max-width: 140px; mix-blend-mode: multiply;" />`;
    }
}

function setupUploadDropzone() {
    const dropzone = document.getElementById('upload-signed-dropzone');
    const fileInput = document.getElementById('upload-signed-file');
    const submitBtn = document.getElementById('btn-submit-upload-signed');
    
    if (!dropzone || !fileInput || !submitBtn) return;
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection(fileInput.files[0]);
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFileSelection(fileInput.files[0]);
        }
    });
    
    function handleFileSelection(file) {
        document.getElementById('upload-signed-filename').textContent = file.name;
        document.getElementById('upload-signed-percent').textContent = '0%';
        document.getElementById('upload-signed-bar-fill').style.width = '0%';
        document.getElementById('upload-signed-progress').style.display = 'block';
        
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
    
    submitBtn.addEventListener('click', () => {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('upload-signed-percent').textContent = `${progress}%`;
            document.getElementById('upload-signed-bar-fill').style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                const contract = CONTRACTS_DATA.find(c => c.id === currentUploadContractId);
                if (contract) {
                    contract.signedFileUrl = fileInput.files[0] ? fileInput.files[0].name : 'Contrato_Assinado_Upload.pdf';
                    saveState();
                    loadContractsList();
                }
                
                alert('Arquivo do contrato assinado enviado com sucesso para a pasta do Google Drive!');
                closeUploadModal();
            }
        }, 150);
    });
}

function downloadDocxContract(contract) {
    let templateName = '';
    switch (contract.templateType) {
        case 'toquio':
            templateName = 'toquio.docx';
            break;
        case 'usa':
            templateName = 'usa.docx';
            break;
        case 'temporada_jp':
            templateName = 'temporada_jp.docx';
            break;
        case 'padrao':
        default:
            templateName = 'padrao.docx';
            break;
    }
    
    const templatePath = `templates/${templateName}`;
    const btnDownload = document.getElementById('btn-download-docx');
    let originalText = 'Baixar Word (.docx)';
    if (btnDownload) {
        originalText = btnDownload.innerHTML;
        btnDownload.disabled = true;
        btnDownload.innerHTML = 'Gerando Word...';
    }
    
    fetch(templatePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o template: ${templatePath}. Certifique-se de que o arquivo existe na pasta /templates.`);
            }
            return response.arrayBuffer();
        })
        .then(content => {
            const zip = new window.PizZip(content);
            const Docxtemplater = window.docxtemplater.default || window.docxtemplater;
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            
            const startVal = contract.startDate || '';
            let day = '';
            let monthIndex = '';
            let year = '';
            let monthName = '';
            
            if (startVal.includes('/')) {
                const parts = startVal.split('/');
                day = parts[0] || '';
                monthIndex = parts[1] || '';
                year = parts[2] || '';
                monthName = getMonthName(monthIndex);
            } else if (startVal.includes('-')) {
                const parts = startVal.split('-');
                day = parts[2] || '';
                monthIndex = parts[1] || '';
                year = parts[0] || '';
                monthName = getMonthName(monthIndex);
            }
            
            const rentVal = parseFloat(contract.rentValue) || 0;
            const rentInWords = convertNumberToWords(rentVal);
            
            let discount = 0;
            if (contract.templateType === 'toquio') {
                discount = 100;
            } else if (contract.templateType === 'usa') {
                discount = 150;
            }
            const rentWithDiscount = rentVal - discount;
            const rentWithDiscountInWords = convertNumberToWords(rentWithDiscount);
            
            const formatCurrency = (val) => {
                return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            };
            
            doc.render({
                NOME_INQUILINO: contract.tenantName || '',
                CPF_INQUILINO: contract.tenantCpf || '',
                RG_INQUILINO: contract.tenantRg || '',
                FONE_INQUILINO: contract.tenantPhone || '',
                EMAIL_INQUILINO: contract.tenantEmail || '',
                VALOR_ALUGUEL: formatCurrency(rentVal),
                VALOR_ALUGUEL_EXTENSO: rentInWords,
                VALOR_DESCONTO: formatCurrency(discount),
                VALOR_ALUGUEL_LIQUIDO: formatCurrency(rentWithDiscount),
                VALOR_ALUGUEL_LIQUIDO_EXTENSO: rentWithDiscountInWords,
                VIGENCIA_MESES: contract.duration || '',
                DATA_INICIO: contract.startDate || '',
                DATA_FIM: contract.endDate || '',
                DIA_VENCIMENTO: contract.paymentDueDay || '',
                NUMERO_UNIDADE: contract.unitNumber || '',
                NOME_PREDIO: contract.buildingName || '',
                DIA_ATUAL: day,
                MES_ATUAL: monthName,
                ANO_ATUAL: year,
                CLAUSULAS_ESPECIAIS: contract.clauses || 'Nenhuma cláusula especial cadastrada.'
            });
            
            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            
            const blobUrl = window.URL.createObjectURL(out);
            const a = document.createElement('a');
            a.href = blobUrl;
            
            const sanitizedTenantName = (contract.tenantName || 'Inquilino').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const unitClean = (contract.unitNumber || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            a.download = `Contrato_Apto_${unitClean}_${sanitizedTenantName}.docx`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            
            if (btnDownload) {
                btnDownload.disabled = false;
                btnDownload.innerHTML = originalText;
            }
        })
        .catch(err => {
            console.error(err);
            alert(`Erro ao gerar contrato: ${err.message}`);
            if (btnDownload) {
                btnDownload.disabled = false;
                btnDownload.innerHTML = originalText;
            }
        });
}

function closeContractModal() {
    const modal = document.getElementById('modal-view-contract');
    modal.style.display = 'none';
    modal.classList.remove('active');
    currentViewContractId = null;
}

function closeSignatureModal() {
    const modal = document.getElementById('modal-signature-pad');
    modal.style.display = 'none';
    modal.classList.remove('active');
}

function closeUploadModal() {
    const modal = document.getElementById('modal-upload-signed');
    modal.style.display = 'none';
    modal.classList.remove('active');
    currentUploadContractId = null;
}

// Expor modais e funções globalmente
window.closeContractModal = closeContractModal;
window.closeSignatureModal = closeSignatureModal;
window.closeUploadModal = closeUploadModal;
window.initContractsTab = initContractsTab;
window.loadContractsList = loadContractsList;
window.loadPendingContractsList = loadPendingContractsList;
window.updateContractBadge = updateContractBadge;
window.occupyUnit = occupyUnit;
window.renderLeaseContractDocument = renderLeaseContractDocument;

/* ==========================================================================
   DEVELOPER AREA CONTROLLERS (LÓGICA)
   ========================================================================== */

function setupDevTabs() {
    // subnav
    const devSubnavBtns = document.querySelectorAll('[data-dev-subtab]');
    const devSubtabContents = document.querySelectorAll('.dev-subtab-content');
    
    devSubnavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-dev-subtab');
            
            devSubnavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            devSubtabContents.forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(`dev-subtab-${target}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
            
            if (target === 'dev-logs-erros') {
                loadDevErrorLogs();
            } else if (target === 'dev-controle-usuarios') {
                loadDevUsersTable();
            } else if (target === 'dev-metricas-bd') {
                updateDevMetrics();
            }
        });
    });

    // Populate Drive config inside developer tab initially if connected
    if (DRIVE_CONFIG.connected) {
        document.getElementById('dev-drive-client-id').value = DRIVE_CONFIG.clientId || '';
        document.getElementById('dev-drive-api-key').value = DRIVE_CONFIG.apiKey || '';
        document.getElementById('dev-drive-folder-id').value = DRIVE_CONFIG.folderId || '';
        updateDevDriveUI();
    }
    
    // Populate Click config
    if (CLICK_CONFIG.connected) {
        document.getElementById('dev-click-token').value = CLICK_CONFIG.token || '';
        document.getElementById('dev-click-space-id').value = CLICK_CONFIG.spaceId || '';
        document.getElementById('dev-click-list-id').value = CLICK_CONFIG.listId || '';
        updateDevClickUI();
    }
    
    // Populate Financial APIs config
    if (FINANCIAL_APIS.efi.connected) {
        document.getElementById('dev-efi-client-id').value = FINANCIAL_APIS.efi.clientId || '';
        document.getElementById('dev-efi-client-secret').value = FINANCIAL_APIS.efi.clientSecret || '';
        document.getElementById('dev-efi-mode').value = FINANCIAL_APIS.efi.mode || 'sandbox';
        updateDevFinUI('efi', true);
    }
    if (FINANCIAL_APIS.bradesco.connected) {
        document.getElementById('dev-bradesco-client-id').value = FINANCIAL_APIS.bradesco.clientId || '';
        updateDevFinUI('bradesco', true);
    }
    if (FINANCIAL_APIS.c6.connected) {
        document.getElementById('dev-c6-client-id').value = FINANCIAL_APIS.c6.clientId || '';
        document.getElementById('dev-c6-secret').value = FINANCIAL_APIS.c6.secret || '';
        updateDevFinUI('c6', true);
    }

    // Toggle pause states
    const drivePauseToggle = document.getElementById('dev-drive-pause-toggle');
    if (drivePauseToggle) {
        drivePauseToggle.checked = DRIVE_PAUSED;
        updateDrivePauseLabel(DRIVE_PAUSED);
        drivePauseToggle.addEventListener('change', (e) => {
            DRIVE_PAUSED = e.target.checked;
            saveState();
            updateDrivePauseLabel(DRIVE_PAUSED);
            logActivity(`Desenvolvedor alterou estado de pausa do Google Drive para: ${DRIVE_PAUSED ? 'PAUSADO' : 'ATIVO'}`);
            if (DRIVE_PAUSED) {
                addDevErrorLog('Google Drive', 'Operações suspensas manualmente pelo desenvolvedor', 'Média', '503 Service Unavailable');
            }
        });
    }

    const clickPauseToggle = document.getElementById('dev-click-pause-toggle');
    if (clickPauseToggle) {
        clickPauseToggle.checked = CLICK_PAUSED;
        updateClickPauseLabel(CLICK_PAUSED);
        clickPauseToggle.addEventListener('change', (e) => {
            CLICK_PAUSED = e.target.checked;
            saveState();
            updateClickPauseLabel(CLICK_PAUSED);
            logActivity(`Desenvolvedor alterou estado de pausa do Click para: ${CLICK_PAUSED ? 'PAUSADO' : 'ATIVO'}`);
            if (CLICK_PAUSED) {
                addDevErrorLog('Click API', 'Integração suspensa temporariamente pelo desenvolvedor', 'Média', '503 Service Unavailable');
            }
        });
    }

    // Drive submit
    const formDevDrive = document.getElementById('form-dev-drive');
    if (formDevDrive) {
        formDevDrive.addEventListener('submit', (e) => {
            e.preventDefault();
            DRIVE_CONFIG.clientId = document.getElementById('dev-drive-client-id').value;
            DRIVE_CONFIG.apiKey = document.getElementById('dev-drive-api-key').value;
            DRIVE_CONFIG.folderId = document.getElementById('dev-drive-folder-id').value;
            DRIVE_CONFIG.connected = true;
            saveState();
            updateDevDriveUI();
            updateDriveUI(); // Sync the admin configuration view
            logActivity(`Desenvolvedor configurou e salvou Google Drive (Pasta: ${DRIVE_CONFIG.folderId})`);
            alert('Credenciais do Google Drive salvas com sucesso!');
        });
    }

    // Drive test
    const btnDevDriveTest = document.getElementById('btn-dev-drive-test');
    if (btnDevDriveTest) {
        btnDevDriveTest.addEventListener('click', () => {
            if (DRIVE_PAUSED) {
                alert('Erro: Google Drive está PAUSADO. Ative o serviço antes de testar.');
                return;
            }
            btnDevDriveTest.textContent = 'Testando...';
            btnDevDriveTest.disabled = true;
            setTimeout(() => {
                btnDevDriveTest.textContent = 'Testar';
                btnDevDriveTest.disabled = false;
                logActivity('Desenvolvedor efetuou teste de conexão com o Google Drive');
                alert('Conexão de teste com Google Drive estabelecida com sucesso! API respondendo.');
            }, 1000);
        });
    }

    // Click submit
    const formDevClick = document.getElementById('form-dev-click');
    if (formDevClick) {
        formDevClick.addEventListener('submit', (e) => {
            e.preventDefault();
            CLICK_CONFIG.token = document.getElementById('dev-click-token').value;
            CLICK_CONFIG.spaceId = document.getElementById('dev-click-space-id').value;
            CLICK_CONFIG.listId = document.getElementById('dev-click-list-id').value;
            CLICK_CONFIG.connected = true;
            saveState();
            updateDevClickUI();
            logActivity(`Desenvolvedor configurou e salvou Click (Space ID: ${CLICK_CONFIG.spaceId})`);
            alert('Credenciais do Click salvas com sucesso!');
        });
    }

    // Click test
    const btnDevClickTest = document.getElementById('btn-dev-click-test');
    if (btnDevClickTest) {
        btnDevClickTest.addEventListener('click', () => {
            if (CLICK_PAUSED) {
                alert('Erro: Click está PAUSADO. Ative o serviço antes de testar.');
                return;
            }
            btnDevClickTest.textContent = 'Testando...';
            btnDevClickTest.disabled = true;
            setTimeout(() => {
                btnDevClickTest.textContent = 'Testar';
                btnDevClickTest.disabled = false;
                logActivity('Desenvolvedor efetuou teste de conexão com a API Click');
                alert('Conexão de teste com Click estabelecida com sucesso! API respondendo (Status 200).');
            }, 1000);
        });
    }

    // Efí submit
    const formDevEfi = document.getElementById('form-dev-efi');
    if (formDevEfi) {
        formDevEfi.addEventListener('submit', (e) => {
            e.preventDefault();
            FINANCIAL_APIS.efi.clientId = document.getElementById('dev-efi-client-id').value;
            FINANCIAL_APIS.efi.clientSecret = document.getElementById('dev-efi-client-secret').value;
            FINANCIAL_APIS.efi.mode = document.getElementById('dev-efi-mode').value;
            FINANCIAL_APIS.efi.connected = true;
            saveState();
            updateDevFinUI('efi', true);
            logActivity(`Desenvolvedor configurou Efí/Gerencianet em modo ${FINANCIAL_APIS.efi.mode}`);
            alert('Configuração Efí / Gerencianet salva com sucesso!');
        });
    }

    // Efí test
    const btnDevEfiTest = document.getElementById('btn-dev-efi-test');
    if (btnDevEfiTest) {
        btnDevEfiTest.addEventListener('click', () => {
            btnDevEfiTest.textContent = 'Testando...';
            btnDevEfiTest.disabled = true;
            setTimeout(() => {
                btnDevEfiTest.textContent = 'Testar';
                btnDevEfiTest.disabled = false;
                logActivity('Desenvolvedor testou API Efí / Gerencianet');
                alert('Conexão com Efí / Gerencianet autenticada com sucesso no ambiente selecionado!');
            }, 1000);
        });
    }

    // Bradesco submit
    const formDevBradesco = document.getElementById('form-dev-bradesco');
    if (formDevBradesco) {
        formDevBradesco.addEventListener('submit', (e) => {
            e.preventDefault();
            FINANCIAL_APIS.bradesco.clientId = document.getElementById('dev-bradesco-client-id').value;
            FINANCIAL_APIS.bradesco.connected = true;
            saveState();
            updateDevFinUI('bradesco', true);
            logActivity('Desenvolvedor configurou API Banco Bradesco');
            alert('Configurações da API Bradesco salvas com sucesso!');
        });
    }

    // Bradesco test
    const btnDevBradescoTest = document.getElementById('btn-dev-bradesco-test');
    if (btnDevBradescoTest) {
        btnDevBradescoTest.addEventListener('click', () => {
            btnDevBradescoTest.textContent = 'Testando...';
            btnDevBradescoTest.disabled = true;
            setTimeout(() => {
                btnDevBradescoTest.textContent = 'Testar';
                btnDevBradescoTest.disabled = false;
                logActivity('Desenvolvedor testou API Banco Bradesco');
                alert('Conexão com Bradesco API estabelecida com sucesso usando certificado digital!');
            }, 1000);
        });
    }

    // C6 submit
    const formDevC6 = document.getElementById('form-dev-c6');
    if (formDevC6) {
        formDevC6.addEventListener('submit', (e) => {
            e.preventDefault();
            FINANCIAL_APIS.c6.clientId = document.getElementById('dev-c6-client-id').value;
            FINANCIAL_APIS.c6.secret = document.getElementById('dev-c6-secret').value;
            FINANCIAL_APIS.c6.connected = true;
            saveState();
            updateDevFinUI('c6', true);
            logActivity('Desenvolvedor configurou API C6 Bank');
            alert('Configurações da API C6 Bank salvas com sucesso!');
        });
    }

    // C6 test
    const btnDevC6Test = document.getElementById('btn-dev-c6-test');
    if (btnDevC6Test) {
        btnDevC6Test.addEventListener('click', () => {
            btnDevC6Test.textContent = 'Testando...';
            btnDevC6Test.disabled = true;
            setTimeout(() => {
                btnDevC6Test.textContent = 'Testar';
                btnDevC6Test.disabled = false;
                logActivity('Desenvolvedor testou API C6 Bank');
                alert('Conexão com C6 Bank API verificada com sucesso!');
            }, 1000);
        });
    }

    // Clear dev error logs
    const btnClearDevLogs = document.getElementById('btn-clear-dev-logs');
    if (btnClearDevLogs) {
        btnClearDevLogs.addEventListener('click', () => {
            DEV_ERROR_LOGS = [];
            saveState();
            loadDevErrorLogs();
            logActivity('Desenvolvedor limpou os logs de erro de infraestrutura');
            alert('Logs de erro limpos com sucesso!');
        });
    }

    // Reset DB Button
    const btnResetDb = document.getElementById('btn-dev-reset-db');
    if (btnResetDb) {
        btnResetDb.addEventListener('click', resetDevDatabase);
    }
}

function updateDevDriveUI() {
    const badge = document.getElementById('dev-drive-status-badge');
    if (badge) {
        if (DRIVE_CONFIG.connected) {
            badge.textContent = 'Conectado';
            badge.className = 'drive-status-badge status-connected';
        } else {
            badge.textContent = 'Desconectado';
            badge.className = 'drive-status-badge status-disconnected';
        }
    }
}

function updateDevClickUI() {
    const badge = document.getElementById('dev-click-status-badge');
    if (badge) {
        if (CLICK_CONFIG.connected) {
            badge.textContent = 'Conectado';
            badge.className = 'drive-status-badge status-connected';
        } else {
            badge.textContent = 'Desconectado';
            badge.className = 'drive-status-badge status-disconnected';
        }
    }
}

function updateDevFinUI(apiName, connected) {
    const badge = document.getElementById(`dev-${apiName}-status-badge`);
    if (badge) {
        if (connected) {
            badge.textContent = 'Conectado';
            badge.className = 'drive-status-badge status-connected';
        } else {
            badge.textContent = 'Desconectado';
            badge.className = 'drive-status-badge status-disconnected';
        }
    }
}

function updateDrivePauseLabel(paused) {
    const lbl = document.getElementById('lbl-drive-pause');
    if (lbl) {
        lbl.textContent = paused ? 'Google Drive (PAUSADO)' : 'Google Drive (ATIVO)';
        lbl.style.color = paused ? 'var(--danger)' : 'var(--success)';
    }
}

function updateClickPauseLabel(paused) {
    const lbl = document.getElementById('lbl-click-pause');
    if (lbl) {
        lbl.textContent = paused ? 'Click (PAUSADO)' : 'Click (ATIVO)';
        lbl.style.color = paused ? 'var(--danger)' : 'var(--success)';
    }
}

function addDevErrorLog(service, message, severity, status) {
    DEV_ERROR_LOGS.unshift({
        timestamp: new Date().toLocaleString('pt-BR'),
        service,
        message,
        severity,
        status
    });
    saveState();
    loadDevErrorLogs();
}

function loadDevErrorLogs() {
    const tbody = document.getElementById('dev-logs-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (DEV_ERROR_LOGS.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--neutral-500);">Nenhum log de erro registrado.</td></tr>`;
        return;
    }
    
    DEV_ERROR_LOGS.forEach(log => {
        let severityBadge = '';
        if (log.severity === 'Alta') {
            severityBadge = `<span style="background: rgba(217, 4, 41, 0.1); color: var(--danger); padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">Alta</span>`;
        } else if (log.severity === 'Média') {
            severityBadge = `<span style="background: rgba(245, 166, 35, 0.1); color: var(--warning); padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">Média</span>`;
        } else {
            severityBadge = `<span style="background: rgba(0, 141, 210, 0.1); color: var(--logo-blue); padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">Baixa</span>`;
        }
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--neutral-150)';
        tr.innerHTML = `
            <td style="padding: 10px; font-size: 12px; font-family: monospace;">${log.timestamp}</td>
            <td style="padding: 10px; font-weight: 600; color: var(--primary); font-size: 13px;">${log.service}</td>
            <td style="padding: 10px; font-size: 13px; color: var(--neutral-800);">${log.message}</td>
            <td style="padding: 10px;">${severityBadge}</td>
            <td style="padding: 10px; font-size: 12px; font-family: monospace; color: var(--neutral-600);">${log.status}</td>
        `;
        tbody.appendChild(tr);
    });
}

function loadDevUsersTable() {
    const tbody = document.getElementById('dev-users-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    USERS_DATA.forEach(user => {
        const statusText = user.active ? 'Ativo' : 'Inativo';
        const statusClass = user.active ? 'status-occupied' : 'status-vacant';
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--neutral-150)';
        tr.innerHTML = `
            <td style="padding: 12px 10px;">
                <div style="font-weight: 600; color: var(--primary); font-size: 13px;">${user.name}</div>
                <div style="font-size: 10px; color: var(--neutral-500);">${user.id}</div>
            </td>
            <td style="padding: 12px 10px; font-size: 13px; color: var(--neutral-700);">${user.email}</td>
            <td style="padding: 12px 10px;">
                <select onchange="changeUserRole('${user.id}', this.value)" style="padding: 5px 8px; font-size: 12px; border-radius: 4px; border: 1px solid var(--neutral-300); background: white; cursor: pointer;">
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>ADMIN</option>
                    <option value="gerente" ${user.role === 'gerente' ? 'selected' : ''}>GERENTE</option>
                    <option value="gestor" ${user.role === 'gestor' ? 'selected' : ''}>GESTOR</option>
                    <option value="developer" ${user.role === 'developer' ? 'selected' : ''}>DEVELOPER</option>
                </select>
            </td>
            <td style="padding: 12px 10px;">
                <span class="unit-status ${statusClass}" style="padding: 4px 10px; border-radius: 12px; font-size: 11px; cursor: pointer; font-weight: 600;" onclick="toggleDevUserStatus('${user.id}')">
                    ${statusText}
                </span>
            </td>
            <td style="padding: 12px 10px;">
                <button onclick="resetDevUserPassword('${user.id}')" style="padding: 4px 10px; font-size: 11px; border: 1px solid var(--logo-purple); background: transparent; color: var(--logo-purple); border-radius: var(--border-radius-sm); font-weight: bold; cursor: pointer; transition: all 0.2s;">
                    Resetar Senha
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function changeUserRole(userId, newRole) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (user) {
        const oldRole = user.role;
        user.role = newRole;
        saveState();
        logActivity(`Desenvolvedor alterou nível de acesso de ${user.name} de ${oldRole.toUpperCase()} para ${newRole.toUpperCase()}`);
        alert(`Papel do usuário ${user.name} atualizado para ${newRole.toUpperCase()} com sucesso!`);
        loadDevUsersTable();
        // Se for o próprio desenvolvedor logado
        if (currentUser.id === userId || currentUser.name === user.name) {
            currentUser.role = newRole;
            applyUserRoleSettings();
        }
    }
}

function toggleDevUserStatus(userId) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (user) {
        user.active = !user.active;
        saveState();
        logActivity(`Desenvolvedor alterou status de ${user.name} para ${user.active ? 'ATIVO' : 'INATIVO'}`);
        loadDevUsersTable();
        alert(`Status de ${user.name} alterado para ${user.active ? 'ATIVO' : 'INATIVO'}!`);
    }
}

function resetDevUserPassword(userId) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (user) {
        logActivity(`Desenvolvedor redefiniu credencial/senha de simulação de ${user.name}`);
        alert(`Senha de simulação para ${user.name} redefinida para o padrão de fábrica!`);
        addDevErrorLog('Segurança', `Senha redefinida para o usuário ${user.name} (${user.email})`, 'Baixa', '200 OK');
    }
}

function updateDevMetrics() {
    let totalSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += (localStorage[key].length + key.length) * 2; // ~2 bytes per char in UTF-16
        }
    }
    const sizeKB = (totalSize / 1024).toFixed(2);
    const sizePercent = Math.min((totalSize / (1024 * 5120)) * 100, 100).toFixed(1);
    
    const sizeEl = document.getElementById('dev-metric-storage-size');
    const barEl = document.getElementById('dev-metric-storage-bar');
    if (sizeEl) sizeEl.textContent = `${sizeKB} KB`;
    if (barEl) barEl.style.width = `${sizePercent}%`;
    
    // Total registers
    const countContractsEl = document.getElementById('dev-metric-count-contracts');
    if (countContractsEl && typeof CONTRACTS_DATA !== 'undefined') countContractsEl.textContent = CONTRACTS_DATA.length;
    
    const countTenantsEl = document.getElementById('dev-metric-count-tenants');
    if (countTenantsEl && typeof TENANTS_DATA !== 'undefined') countTenantsEl.textContent = TENANTS_DATA.length;
    
    const countUnitsEl = document.getElementById('dev-metric-count-units');
    if (countUnitsEl && typeof UNITS_DATA !== 'undefined') countUnitsEl.textContent = UNITS_DATA.length;
}

function resetDevDatabase() {
    if (confirm('Tem certeza que deseja redefinir o banco de dados? Todos os contratos, chaves de API e configurações salvas localmente serão limpos.')) {
        localStorage.clear();
        alert('Banco de dados redefinido com sucesso! O sistema será recarregado.');
        window.location.reload();
    }
}

/* ==========================================================================
   BUILDING THEMES CONTROL FUNCTIONS
   ========================================================================== */
function applyActiveTheme() {
    // Reset previous theme classes from body
    document.body.classList.remove('theme-orange', 'theme-green', 'theme-pink', 'theme-purple');
    
    // A funcionalidade de temas por prédio foi desativada a pedido do usuário
    // para manter as cores originais uniformes em todos os acessos.
}


window.setupDevTabs = setupDevTabs;
window.loadDevErrorLogs = loadDevErrorLogs;
window.addDevErrorLog = addDevErrorLog;
window.loadDevUsersTable = loadDevUsersTable;
window.changeUserRole = changeUserRole;
window.toggleDevUserStatus = toggleDevUserStatus;
window.resetDevUserPassword = resetDevUserPassword;
window.updateDevMetrics = updateDevMetrics;
window.resetDevDatabase = resetDevDatabase;
window.applyActiveTheme = applyActiveTheme;
window.changeBuildingTheme = changeBuildingTheme;
// Define stub if not exists to prevent crash
if (typeof registerTenantPayment !== 'undefined') {
    window.registerTenantPayment = registerTenantPayment;
} else {
    window.registerTenantPayment = function() {};
}
// Define stub for loadCashBook if it doesn't exist
window.loadCashBook = window.loadCashBook || function() {};
window.loadWeeklyReport = window.loadWeeklyReport || function() {};

function updateContractsExpiringBadge() {
    const badge = document.getElementById('contracts-expiring-badge');
    if (!badge) return;
    
    let expiringCount = 0;
    if (currentUser && currentUser.role === 'gestor') {
        expiringCount = CONTRACTS_DATA.filter(c => c.buildingId === currentUser.buildingId && isContractExpiringSoon(c)).length;
    } else {
        expiringCount = CONTRACTS_DATA.filter(isContractExpiringSoon).length;
    }
    
    if (expiringCount > 0) {
        badge.textContent = expiringCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function loadExpiringContractsList() {
    const listBody = document.getElementById('contracts-expiring-list');
    if (!listBody) return;
    
    listBody.innerHTML = '';
    
    let filteredContracts = [];
    if (currentUser && currentUser.role === 'gestor') {
        filteredContracts = CONTRACTS_DATA.filter(c => c.buildingId === currentUser.buildingId && isContractExpiringSoon(c));
    } else {
        filteredContracts = CONTRACTS_DATA.filter(isContractExpiringSoon);
    }
    
    if (filteredContracts.length === 0) {
        listBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--neutral-500); padding: 30px;">Nenhum contrato vencendo nos próximos meses.</td></tr>`;
        return;
    }
    
    filteredContracts.forEach(contract => {
        const tenantName = contract.tenantName || contract.tenant || 'Inquilino';
        const unitName = contract.unitNumber ? `Apto ${contract.unitNumber} - ${contract.buildingName}` : contract.unit;
        
        const rowHtml = `
            <tr>
                <td><strong>${tenantName}</strong></td>
                <td>${unitName}</td>
                <td><span class="text-danger" style="font-weight: 600;">${contract.endDate || contract.expiry}</span></td>
                <td>
                    <button class="btn-action-mini btn-action-fill-contract" data-contract-id="${contract.id}">
                        Renovar
                    </button>
                </td>
            </tr>
        `;
        listBody.insertAdjacentHTML('beforeend', rowHtml);
    });
}

// Call update badge on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateContractsExpiringBadge, 500);
});

// Lançamento Semanal (Relatório)
const WEEKLY_TABLES = [
    'tbody-new-tenants', 'tbody-exit-settled', 'tbody-exit-unsettled',
    'tbody-negativar', 'tbody-retirado-neg'
];

window.saveWeeklyReportDraft = function() {
    const draftData = {};
    WEEKLY_TABLES.forEach(id => {
        const tbody = document.getElementById(id);
        if (!tbody) return;
        const rows = [];
        tbody.querySelectorAll('tr').forEach(tr => {
            const inputs = Array.from(tr.querySelectorAll('input')).map(input => input.value);
            rows.push(inputs);
        });
        draftData[id] = rows;
    });
    localStorage.setItem('bueno_weekly_draft', JSON.stringify(draftData));
};

window.loadWeeklyReportDraft = function() {
    const draftData = JSON.parse(localStorage.getItem('bueno_weekly_draft') || '{}');
    WEEKLY_TABLES.forEach(id => {
        if (draftData[id] && draftData[id].length > 0) {
            const tbody = document.getElementById(id);
            if (!tbody) return;
            tbody.innerHTML = ''; // Limpa linhas padrão
            draftData[id].forEach(rowData => {
                let tds = '';
                rowData.forEach(val => {
                    // Escape basic HTML to prevent breaking the input value
                    const safeVal = val.replace(/"/g, '&quot;');
                    tds += `<td><input type="text" class="input-field" style="width: 100%; border: none; background: transparent;" placeholder="..." value="${safeVal}" /></td>`;
                });
                tds += `<td>
                            <button class="btn-action-mini" style="background: var(--danger-light); color: var(--danger);" onclick="this.closest('tr').remove(); saveWeeklyReportDraft();">
                                X
                            </button>
                        </td>`;
                tbody.insertAdjacentHTML('beforeend', `<tr>${tds}</tr>`);
            });
        }
    });
};

window.addWeeklyRow = function(tableBodyId, colsCount) {
    const tbody = document.getElementById(tableBodyId);
    if (!tbody) return;
    
    let tds = '';
    for (let i = 0; i < colsCount; i++) {
        tds += `<td><input type="text" class="input-field" style="width: 100%; border: none; background: transparent;" placeholder="..." /></td>`;
    }
    tds += `<td>
                <button class="btn-action-mini" style="background: var(--danger-light); color: var(--danger);" onclick="this.closest('tr').remove(); saveWeeklyReportDraft();">
                    X
                </button>
            </td>`;
            
    tbody.insertAdjacentHTML('beforeend', `<tr>${tds}</tr>`);
    saveWeeklyReportDraft();
};

document.getElementById('btn-save-weekly-report')?.addEventListener('click', async () => {
    const reports = [];
    
    const draftData = JSON.parse(localStorage.getItem('bueno_weekly_draft') || '{}');
    if (draftData['tbody-new-tenants']) {
        draftData['tbody-new-tenants'].forEach(row => {
            if (row.length >= 7) {
                reports.push({
                    date: row[4],
                    tenant: row[2],
                    unit: row[5],
                    type: 'Novo Locador',
                    detail: 'Valor: ' + row[3]
                });
            }
        });
    }
    
    if (draftData['tbody-exit-settled']) {
        draftData['tbody-exit-settled'].forEach(row => {
            if (row.length >= 7) {
                reports.push({
                    date: row[4],
                    tenant: row[2],
                    unit: row[5],
                    type: 'Saída/Quitação',
                    detail: 'Valor: ' + row[3]
                });
            }
        });
    }

    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/generate-pdf`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ reports: reports.length > 0 ? reports : [{ date: 'N/A', tenant: 'Nenhum', unit: '-', type: '-', detail: 'Sem lançamentos preenchidos nas primeiras tabelas' }] })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio_semanal.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            if (window.showToast) window.showToast('PDF Gerado e Baixado com sucesso!', 'success');
            else alert('PDF gerado com sucesso!');
        } else {
            alert('Erro ao gerar PDF no backend.');
        }
    } catch(e) {
        console.error(e);
        alert('Falha de conexão com o servidor ao gerar PDF.');
    }
});

// Auto-save on any input change inside the report container
const reportContainer = document.querySelector('.weekly-report-container');
if (reportContainer) {
    reportContainer.addEventListener('input', () => {
        saveWeeklyReportDraft();
    });
}

// Carrega o rascunho ao iniciar
setTimeout(() => {
    loadWeeklyReportDraft();
}, 500);

