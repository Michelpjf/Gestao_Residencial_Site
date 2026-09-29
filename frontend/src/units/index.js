/* Visão operacional de Unidades vinculadas ao Residencial persistido. */
let selectedUnitsBuilding = null;

function setUnitsStatus(message = '', { retry = false, tone = 'neutral' } = {}) {
    const status = document.getElementById('units-status');
    status.hidden = !message;
    status.dataset.tone = tone;
    document.getElementById('units-status-message').textContent = message;
    document.getElementById('btn-retry-units').hidden = !retry;
}

function unitsErrorMessage(error) {
    if (error?.status === 401) return 'Sessão expirada. Entre novamente.';
    if (error?.status === 403) return 'Seu perfil não tem acesso a esta operação.';
    if (error?.code === 'UNIT_ALREADY_EXISTS') return 'Já existe uma Unidade com essa identificação nesta subdivisão.';
    if (error?.code === 'UNIT_INPUT_INVALID') return 'Confira identificação, subdivisão e tipo.';
    if (error?.code === 'UNIT_BATCH_INPUT_INVALID') return 'Confira quantidade, número inicial, sufixo, subdivisão e tipo do lote.';
    if (error?.code === 'UNIT_BATCH_DUPLICATE') return 'A prévia contém identificações repetidas.';
    if (error?.code === 'BUILDING_NOT_FOUND') return 'Residencial não encontrado ou inativo.';
    return 'Não foi possível acessar as Unidades. Tente novamente.';
}

function unitStatusLabel(status) {
    return ({ ocupado: 'Ocupada', agendado: 'Contrato agendado', vago: 'Vaga' })[status] || 'Indefinida';
}

function formatUnitDate(value) {
    if (!value) return '—';
    const [year, month, day] = String(value).slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
}

function filteredUnits() {
    const search = document.getElementById('units-search').value.trim().toLocaleLowerCase('pt-BR');
    const status = document.getElementById('units-status-filter').value;
    const type = document.getElementById('units-type-filter').value;
    const priority = { ocupado: 0, agendado: 1, vago: 2 };
    return window.unitsStore.getAll()
        .filter((unit) => !search || unit.identification.toLocaleLowerCase('pt-BR').includes(search))
        .filter((unit) => status === 'all' || unit.status === status)
        .filter((unit) => type === 'all' || unit.type === type)
        .sort((left, right) => (priority[left.status] ?? 9) - (priority[right.status] ?? 9)
            || left.identification.localeCompare(right.identification, 'pt-BR', { numeric: true }));
}

function renderPersistedUnits() {
    const list = document.getElementById('persisted-units-list');
    list.replaceChildren();
    const units = filteredUnits();
    if (units.length === 0) {
        const hasUnits = window.unitsStore.getAll().length > 0;
        setUnitsStatus(hasUnits ? 'Nenhuma Unidade corresponde aos filtros.' : 'Nenhuma Unidade cadastrada neste Residencial.', { tone: 'empty' });
        return;
    }
    setUnitsStatus();
    const groups = new Map();
    for (const unit of units) {
        const subdivision = unit.subdivision || 'Sem subdivisão';
        if (!groups.has(subdivision)) groups.set(subdivision, []);
        groups.get(subdivision).push(unit);
    }
    for (const [subdivision, groupedUnits] of groups) {
        const section = document.createElement('section');
        section.className = 'unit-map-group';
        const heading = document.createElement('h3');
        heading.textContent = subdivision;
        const grid = document.createElement('div');
        grid.className = 'unit-map-grid';
        for (const unit of groupedUnits) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `unit-map-card unit-status-${unit.status}`;
            button.dataset.unitId = unit.id;
            button.addEventListener('click', () => openPersistedUnit(unit.id));
            const title = document.createElement('strong');
            title.textContent = unit.identification;
            const subtitle = document.createElement('span');
            subtitle.textContent = `${unit.type === 'quarto' ? 'Quarto' : 'Loft'} · ${unitStatusLabel(unit.status)}`;
            const occupancy = document.createElement('span');
            occupancy.textContent = unit.currentTenantName
                ? unit.currentTenantName
                : (unit.scheduledTenantName ? `Próximo: ${unit.scheduledTenantName}` : 'Sem contrato ativo');
            button.append(title, subtitle, occupancy);
            grid.appendChild(button);
        }
        section.append(heading, grid);
        list.appendChild(section);
    }
}

async function refreshPersistedUnits() {
    if (!selectedUnitsBuilding) return;
    const buildingId = selectedUnitsBuilding.id;
    window.unitsStore.clear();
    document.getElementById('persisted-units-list').replaceChildren();
    document.getElementById('persisted-unit-detail').hidden = true;
    setUnitsStatus('Carregando Unidades...');
    try {
        await window.unitsStore.refresh(buildingId);
        if (selectedUnitsBuilding?.id === buildingId) renderPersistedUnits();
    } catch (error) {
        if (selectedUnitsBuilding?.id !== buildingId) return;
        console.error('[Unidades]', error.code || error.message);
        setUnitsStatus(unitsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

async function openPersistedUnit(id) {
    const buildingId = selectedUnitsBuilding?.id;
    const detail = document.getElementById('persisted-unit-detail');
    detail.hidden = true;
    setUnitsStatus('Carregando detalhe...');
    try {
        const unit = await window.unitsStore.get(id);
        if (selectedUnitsBuilding?.id !== buildingId || unit.buildingId !== buildingId) return;
        document.getElementById('persisted-unit-identification').textContent = unit.identification;
        document.getElementById('persisted-unit-subdivision').textContent = `Subdivisão: ${unit.subdivision || 'Não informada'}`;
        document.getElementById('persisted-unit-type').textContent = `Tipo: ${unit.type === 'quarto' ? 'Quarto' : 'Loft'}`;
        document.getElementById('persisted-unit-status').textContent = `Situação: ${unitStatusLabel(unit.status)}`;
        document.getElementById('persisted-unit-occupancy').textContent = unit.currentTenantName
            ? `Morador vigente: ${unit.currentTenantName} · Contrato ${String(unit.currentContractNumber).padStart(3, '0')} · ${formatUnitDate(unit.currentContractStartDate)} a ${formatUnitDate(unit.currentContractEndDate)}`
            : 'Nenhum contrato vigente para esta Unidade.';
        document.getElementById('persisted-unit-scheduled').textContent = unit.scheduledTenantName
            ? `Próximo contrato: ${String(unit.scheduledContractNumber).padStart(3, '0')} · ${unit.scheduledTenantName} · ${formatUnitDate(unit.scheduledContractStartDate)} a ${formatUnitDate(unit.scheduledContractEndDate)}`
            : 'Nenhum contrato agendado.';
        detail.hidden = false;
        setUnitsStatus();
    } catch (error) {
        console.error('[Unidades]', error.code || error.message);
        setUnitsStatus(unitsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

function unitBatchFromForm() {
    const quantity = Number(document.getElementById('batch-unit-quantity').value);
    const start = Number(document.getElementById('batch-unit-start').value);
    const suffix = document.getElementById('batch-unit-suffix').value.trim();
    const subdivision = document.getElementById('batch-unit-subdivision').value;
    const type = document.getElementById('batch-unit-type').value;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 200 || !Number.isInteger(start) || start < 0) return [];
    return Array.from({ length: quantity }, (_, index) => ({
        identification: `${start + index}${suffix}`, subdivision, type,
    }));
}

function renderUnitBatchPreview() {
    const units = unitBatchFromForm();
    const preview = document.getElementById('batch-unit-preview');
    if (units.length === 0) { preview.textContent = 'Informe valores válidos.'; return; }
    const labels = units.slice(0, 12).map((unit) => unit.identification);
    preview.textContent = `${labels.join(', ')}${units.length > labels.length ? ` … +${units.length - labels.length}` : ''}`;
}

function openUnitsForBuilding(building) {
    selectedUnitsBuilding = building;
    document.getElementById('view-predios-list').style.display = 'none';
    document.getElementById('view-predios-detail').style.display = 'block';
    document.getElementById('detail-building-name').textContent = building.name;
    refreshPersistedUnits();
}

function setupUnitsEvents() {
    document.getElementById('btn-retry-units').addEventListener('click', refreshPersistedUnits);
    document.getElementById('btn-close-unit-detail').addEventListener('click', () => {
        document.getElementById('persisted-unit-detail').hidden = true;
    });
    for (const id of ['units-search', 'units-status-filter', 'units-type-filter']) {
        document.getElementById(id).addEventListener('input', renderPersistedUnits);
    }
    for (const id of ['batch-unit-subdivision', 'batch-unit-type', 'batch-unit-quantity', 'batch-unit-start', 'batch-unit-suffix']) {
        document.getElementById(id).addEventListener('input', renderUnitBatchPreview);
    }
    document.getElementById('form-new-units-batch').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!selectedUnitsBuilding || currentUser.role !== 'gerente') return;
        const units = unitBatchFromForm();
        if (units.length === 0) { setUnitsStatus('Confira os dados do lote.', { tone: 'error' }); return; }
        const buildingId = selectedUnitsBuilding.id;
        const form = event.currentTarget;
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        setUnitsStatus(`Criando ${units.length} Unidades...`);
        try {
            await window.unitsStore.createBatch(buildingId, units);
            if (selectedUnitsBuilding?.id !== buildingId) return;
            form.reset();
            document.getElementById('batch-unit-quantity').value = '3';
            document.getElementById('batch-unit-start').value = '1';
            renderUnitBatchPreview();
            renderPersistedUnits();
            setUnitsStatus(`${units.length} Unidades criadas com sucesso.`, { tone: 'success' });
        } catch (error) {
            console.error('[Unidades]', error.code || error.message);
            setUnitsStatus(unitsErrorMessage(error), { tone: 'error' });
        } finally { button.disabled = false; }
    });
    document.getElementById('form-new-unit').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!selectedUnitsBuilding || currentUser.role !== 'gerente') return;
        const buildingId = selectedUnitsBuilding.id;
        const form = event.currentTarget;
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        setUnitsStatus('Cadastrando Unidade...');
        try {
            await window.unitsStore.create(buildingId, {
                identification: document.getElementById('new-unit-identification').value,
                subdivision: document.getElementById('new-unit-subdivision').value,
                type: document.getElementById('new-unit-type').value,
            });
            if (!selectedUnitsBuilding || selectedUnitsBuilding.id !== buildingId) return;
            form.reset();
            renderPersistedUnits();
            setUnitsStatus('Unidade cadastrada com sucesso.', { tone: 'success' });
        } catch (error) {
            console.error('[Unidades]', error.code || error.message);
            setUnitsStatus(unitsErrorMessage(error), { tone: 'error' });
        } finally { button.disabled = false; }
    });
}

window.openUnitsForBuilding = openUnitsForBuilding;
