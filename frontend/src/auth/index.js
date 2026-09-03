/* ==========================================================================
   TELA DE LOGIN: SELEÇÃO DE PERFIS (SIMULAÇÃO)
   ========================================================================== */
// Função setupLoginSelector removida devido à remoção dos chips de simulação no HTML

/* Envio do formulário de Login e Definição de Senha */
function setupForms() {
    const loginForm = document.getElementById('login-form');
    const setPasswordForm = document.getElementById('set-password-form');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const shouldShowPassword = passwordInput.type === 'password';
            passwordInput.type = shouldShowPassword ? 'text' : 'password';
            passwordToggle.setAttribute('aria-pressed', String(shouldShowPassword));
            passwordToggle.setAttribute('aria-label', shouldShowPassword ? 'Ocultar senha' : 'Mostrar senha');
        });
    }
    
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
                        building: user.user_metadata?.building || 'Geral',
                        buildingId: user.user_metadata?.buildingId || 'all'
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
        const errorDiv = document.getElementById('login-error');
        
        const btn = loginForm.querySelector('button[type="submit"]');
        const btnLabel = btn.querySelector('span');
        const oldText = btnLabel ? btnLabel.textContent : btn.textContent;
        if (btnLabel) btnLabel.textContent = 'Validando...';
        else btn.textContent = 'Validando...';
        btn.disabled = true;
        errorDiv.style.display = 'none';

        if (!supabaseClient) {
            errorDiv.textContent = 'Não foi possível conectar. Verifique sua internet e tente novamente.';
            errorDiv.style.display = 'block';
            if (btnLabel) btnLabel.textContent = oldText;
            else btn.textContent = oldText;
            btn.disabled = false;
            return;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: usernameVal,
            password: passwordVal,
        });

        if (error) {
            errorDiv.textContent = 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
            errorDiv.style.display = 'block';
            addDevErrorLog('Segurança', `Falha de login no Supabase para: ${usernameVal}`, 'Alta', '401 Unauthorized');
            if (btnLabel) btnLabel.textContent = oldText;
            else btn.textContent = oldText;
            btn.disabled = false;
            return;
        }
        
        // Se a senha e usuário batem, configura currentUser
        const user = data.user;
        currentUser.role = user.user_metadata?.role || 'admin'; 
        currentUser.name = user.user_metadata?.name || user.email.split('@')[0];
        currentUser.building = user.user_metadata?.building || 'Todos os Prédios';
        currentUser.buildingId = user.user_metadata?.buildingId || 'all';
        
        // Ativar Tela Principal
        document.getElementById('login-container').classList.remove('active');
        document.getElementById('app-container').classList.add('active');
        
        // Resetar o botão de login para quando o usuário sair depois
        if (btnLabel) btnLabel.textContent = oldText;
        else btn.textContent = oldText;
        btn.disabled = false;
        
        // Aplicar Regras de Perfil e carregar informações
        applyUserRoleSettings();
        loadDashboardData();
    });

    // Botão Sair
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn.addEventListener('click', async () => {
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        document.getElementById('login-form').reset();
        document.getElementById('app-container').classList.remove('active');
        document.getElementById('login-container').classList.add('active');
    });
}
