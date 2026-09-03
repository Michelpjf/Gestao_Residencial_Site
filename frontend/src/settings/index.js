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

                const responseText = await response.text();
                let result = {};
                try {
                    result = JSON.parse(responseText);
                } catch(e) {
                    throw new Error(`Resposta do servidor inválida (HTML/Texto): ${responseText.substring(0, 150)}`);
                }

                if (!response.ok) {
                    throw new Error(result.error || `Erro do servidor (Status ${response.status}): ${responseText}`);
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
