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
