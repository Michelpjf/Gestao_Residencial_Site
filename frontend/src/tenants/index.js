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
