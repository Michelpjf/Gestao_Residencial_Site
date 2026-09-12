/* ==========================================================================
   GESTÃO DE PRÉDIOS E UNIDADES (LÓGICA)
   ========================================================================== */

function setBuildingsStatus(message = '', { retry = false, tone = 'neutral' } = {}) {
    const status = document.getElementById('buildings-status');
    const messageElement = document.getElementById('buildings-status-message');
    const retryButton = document.getElementById('btn-retry-buildings');
    if (!status || !messageElement || !retryButton) return;

    status.hidden = !message;
    status.dataset.tone = tone;
    messageElement.textContent = message;
    retryButton.hidden = !retry;
}

function buildingsErrorMessage(error) {
    if (error?.status === 401) return 'Sua sessão expirou. Entre novamente para consultar os residenciais.';
    if (error?.status === 403) return 'Seu perfil não possui permissão para esta operação.';
    if (error?.code === 'BUILDING_NAME_CONFLICT') return 'Já existe um residencial ativo com esse nome.';
    if (error?.code === 'BUILDING_INPUT_INVALID') return 'Informe um nome entre 2 e 160 caracteres.';
    if (error?.code === 'API_TIMEOUT') return 'A consulta demorou mais que o esperado. Tente novamente.';
    return 'Não foi possível acessar os residenciais. Tente novamente.';
}

async function loadBuildingsFromApi() {
    setBuildingsStatus('Carregando residenciais...');
    try {
        await window.buildingsStore.refresh();
        loadBuildingsGrid();
    } catch (error) {
        console.error('[Residenciais]', error.code || error.message);
        document.getElementById('buildings-grid-container')?.replaceChildren();
        setBuildingsStatus(buildingsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

function createBuildingAction(label, className, title, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn-card-action-mini ${className}`;
    button.title = title;
    button.setAttribute('aria-label', title);
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
}

function loadBuildingsGrid() {
    const container = document.getElementById('buildings-grid-container');
    if (!container) return;
    container.replaceChildren();

    const buildings = window.buildingsStore.getAll();
    if (buildings.length === 0) {
        setBuildingsStatus('Nenhum residencial ativo cadastrado.', { tone: 'empty' });
        return;
    }

    setBuildingsStatus();
    buildings.forEach((building) => {
        const card = document.createElement('article');
        card.className = 'predio-card';
        card.dataset.buildingId = building.id;

        const header = document.createElement('div');
        header.className = 'predio-card-header';
        const identity = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'predio-card-title';
        title.textContent = building.name;
        const activeBadge = document.createElement('span');
        activeBadge.className = 'predio-card-units';
        activeBadge.textContent = 'Ativo';
        identity.append(title, activeBadge);

        const actions = document.createElement('div');
        actions.className = 'predio-card-actions-top';
        actions.append(
            createBuildingAction('Editar', 'edit-btn restricted-admin-manager', 'Editar residencial', () => editBuilding(building.id)),
            createBuildingAction('Inativar', 'delete-btn restricted-admin', 'Inativar residencial', (event) => deactivateBuilding(building.id, event.currentTarget)),
        );
        header.append(identity, actions);

        const description = document.createElement('p');
        description.className = 'subtab-desc building-persistence-note';
        description.textContent = 'Cadastro persistido no sistema. Unidades serão vinculadas na próxima etapa.';
        card.append(header, description);
        container.appendChild(card);
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

function resetBuildingForm() {
    editingBuildingId = null;
    const form = document.getElementById('form-new-building');
    const formCard = document.getElementById('building-form-card');
    const toggleFormButton = document.getElementById('btn-toggle-building-form');
    form?.reset();
    formCard?.classList.remove('active');
    toggleFormButton?.classList.remove('btn-active');

    const title = formCard?.querySelector('h4');
    const submitButton = form?.querySelector('button[type="submit"]');
    if (title) title.textContent = 'Cadastrar Novo Residencial';
    if (submitButton) submitButton.textContent = 'Salvar Residencial';
}

function setupBuildingsEvents() {
    const toggleFormBtn = document.getElementById('btn-toggle-building-form');
    const formCard = document.getElementById('building-form-card');
    const cancelFormBtn = document.getElementById('btn-cancel-building');
    
    if (toggleFormBtn && formCard) {
        toggleFormBtn.addEventListener('click', () => {
            if (formCard.classList.contains('active')) resetBuildingForm();
            else {
                formCard.classList.add('active');
                toggleFormBtn.classList.add('btn-active');
                document.getElementById('new-building-name')?.focus();
            }
        });
    }
    if (cancelFormBtn && formCard) {
        cancelFormBtn.addEventListener('click', resetBuildingForm);
    }

    document.getElementById('btn-retry-buildings')?.addEventListener('click', loadBuildingsFromApi);
    
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
        formNewBuilding.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nameInput = document.getElementById('new-building-name');
            const submitButton = formNewBuilding.querySelector('button[type="submit"]');
            const name = nameInput.value.trim();
            if (name.length < 2 || name.length > 160) {
                setBuildingsStatus('Informe um nome entre 2 e 160 caracteres.', { tone: 'error' });
                nameInput.focus();
                return;
            }

            const wasEditing = Boolean(editingBuildingId);
            submitButton.disabled = true;
            submitButton.textContent = wasEditing ? 'Atualizando...' : 'Salvando...';
            setBuildingsStatus(wasEditing ? 'Atualizando residencial...' : 'Salvando residencial...');

            try {
                if (wasEditing) await window.buildingsStore.update(editingBuildingId, name);
                else await window.buildingsStore.create(name);

                resetBuildingForm();
                loadBuildingsGrid();
                setBuildingsStatus(
                    wasEditing ? 'Residencial atualizado com sucesso.' : 'Residencial cadastrado com sucesso.',
                    { tone: 'success' },
                );
            } catch (error) {
                console.error('[Residenciais]', error.code || error.message);
                setBuildingsStatus(buildingsErrorMessage(error), { tone: 'error' });
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = editingBuildingId ? 'Atualizar Residencial' : 'Salvar Residencial';
            }
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

function editBuilding(buildingId) {
    const building = window.buildingsStore.getAll().find((item) => item.id === buildingId);
    if (!building) return;

    editingBuildingId = buildingId;
    const formCard = document.getElementById('building-form-card');
    const toggleFormBtn = document.getElementById('btn-toggle-building-form');
    if (formCard) formCard.classList.add('active');
    if (toggleFormBtn) toggleFormBtn.classList.add('btn-active');

    document.getElementById('new-building-name').value = building.name;

    const titleEl = formCard.querySelector('h4');
    if (titleEl) titleEl.textContent = 'Editar Residencial';
    const submitBtn = formCard.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Atualizar Residencial';

    formCard.scrollIntoView({ behavior: 'smooth' });
}

async function deactivateBuilding(buildingId, button) {
    if (currentUser.role !== 'admin') {
        setBuildingsStatus('Somente administradores podem inativar residenciais.', { tone: 'error' });
        return;
    }

    const building = window.buildingsStore.getAll().find((item) => item.id === buildingId);
    if (!building) return;

    const confirmed = confirm(`Inativar o residencial "${building.name}"? O cadastro deixará de aparecer, mas seu histórico será preservado.`);
    if (!confirmed) return;

    button.disabled = true;
    setBuildingsStatus('Inativando residencial...');
    try {
        await window.buildingsStore.deactivate(buildingId);
        loadBuildingsGrid();
        setBuildingsStatus('Residencial inativado com sucesso.', { tone: 'success' });
    } catch (error) {
        console.error('[Residenciais]', error.code || error.message);
        setBuildingsStatus(buildingsErrorMessage(error), { tone: 'error' });
        button.disabled = false;
    }
}
