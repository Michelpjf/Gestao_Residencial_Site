/* Login Supabase; perfil e escopo vêm exclusivamente da API. */
const BUSINESS_ROLES = new Set(['admin', 'gerente', 'gestor', 'financeiro', 'manutencao']);
let authFlowVersion = 0;

function closeAuthenticatedPanel() {
    currentUser = { id: null, role: null, name: '', building: '', buildingId: null };
    if (typeof resetTenantsView === 'function') resetTenantsView();
    if (typeof resetContractsView === 'function') resetContractsView();
    document.body.classList.remove(...[...BUSINESS_ROLES].map(role => `role-${role}`), 'role-developer');
    document.getElementById('app-container').classList.remove('active');
    document.getElementById('login-container').classList.add('active');
}

function displayAuthError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

async function openAuthenticatedPanel(user, version) {
    const context = await window.apiClient.get('/auth/context');
    if (version !== authFlowVersion) return;
    if (!context || typeof context.userId !== 'string' ||
        !BUSINESS_ROLES.has(context.role) ||
        (context.role === 'gestor' && !context.buildingId)) {
        throw new Error('Invalid authentication context');
    }

    // O email serve apenas como rótulo visual; papel e escopo não vêm do Supabase.
    currentUser = {
        id: context.userId,
        role: context.role,
        buildingId: context.buildingId || null,
        building: context.buildingId || 'Todos os residenciais',
        name: user?.email?.split('@')[0] || 'Usuário'
    };
    applyUserRoleSettings();
    loadDashboardData();
    if (typeof initTenantsTab === 'function') await initTenantsTab();
    if (typeof initContractsTab === 'function') await initContractsTab();
    document.getElementById('login-container').classList.remove('active');
    document.getElementById('app-container').classList.add('active');
}

function setupForms() {
    const loginForm = document.getElementById('login-form');
    const setPasswordForm = document.getElementById('set-password-form');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const loginError = document.getElementById('login-error');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const visible = passwordInput.type === 'password';
            passwordInput.type = visible ? 'text' : 'password';
            passwordToggle.setAttribute('aria-pressed', String(visible));
            passwordToggle.setAttribute('aria-label', visible ? 'Ocultar senha' : 'Mostrar senha');
        });
    }

    if (isInviteFlow) {
        loginForm.style.display = 'none';
        setPasswordForm.style.display = 'block';
    }

    setPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = document.getElementById('new-password').value;
        const confirmation = document.getElementById('confirm-password').value;
        const errorElement = document.getElementById('set-password-error');
        errorElement.style.display = 'none';
        if (password !== confirmation || password.length < 6) {
            displayAuthError(errorElement, 'Confira a confirmação e use ao menos 6 caracteres.');
            return;
        }
        const button = setPasswordForm.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
            const { error } = await supabaseClient.auth.updateUser({ password });
            if (error) throw error;
            window.history.replaceState(null, null, window.location.pathname);
            const { data } = await supabaseClient.auth.getUser();
            await openAuthenticatedPanel(data?.user, ++authFlowVersion);
        } catch (_error) {
            closeAuthenticatedPanel();
            displayAuthError(errorElement, 'Não foi possível validar a senha e o perfil. Atualize a página e tente novamente.');
        } finally {
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            button.disabled = false;
        }
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const version = ++authFlowVersion;
        closeAuthenticatedPanel();
        loginError.style.display = 'none';
        const button = loginForm.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
            if (!supabaseClient) throw new Error('Auth unavailable');
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: document.getElementById('username').value.trim(),
                password: document.getElementById('password').value
            });
            if (error) throw error;
            await openAuthenticatedPanel(data.user, version);
        } catch (_error) {
            if (version === authFlowVersion) {
                closeAuthenticatedPanel();
                displayAuthError(loginError, 'Não foi possível validar o acesso e o perfil. Confira os dados ou tente novamente.');
            }
        } finally {
            passwordInput.value = '';
            button.disabled = false;
        }
    });

    document.getElementById('btn-logout').addEventListener('click', async () => {
        ++authFlowVersion;
        closeAuthenticatedPanel();
        loginForm.reset();
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient.auth.signOut();
                if (error) throw error;
            } catch (_error) {
                displayAuthError(loginError, 'Não foi possível confirmar a saída no provedor. Não use este navegador até encerrar a sessão.');
            }
        }
    });

    document.addEventListener('bueno:api-unauthorized', () => {
        ++authFlowVersion;
        closeAuthenticatedPanel();
        displayAuthError(loginError, 'Sua sessão não foi autorizada. Entre novamente.');
    });

    // Restaurar apenas depois de todas as telas e handlers estarem prontos.
    (async () => {
        const version = ++authFlowVersion;
        try {
            if (!supabaseClient || isInviteFlow) return;
            const { data, error } = await supabaseClient.auth.getSession();
            if (error) throw error;
            if (data?.session) await openAuthenticatedPanel(data.session.user, version);
        } catch (_error) {
            if (version === authFlowVersion) {
                closeAuthenticatedPanel();
                displayAuthError(loginError, 'Não foi possível restaurar o perfil. Entre novamente.');
            }
        }
    })();
}
