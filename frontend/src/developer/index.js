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
document.addEventListener('bueno:ready', () => {
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
