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
