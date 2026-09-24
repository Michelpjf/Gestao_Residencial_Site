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
    if (error?.code === 'BUILDING_NOT_FOUND') return 'Residencial não encontrado ou inativo.';
    return 'Não foi possível acessar as Unidades. Tente novamente.';
}

function renderPersistedUnits() {
    const list = document.getElementById('persisted-units-list');
    list.replaceChildren();
    const units = window.unitsStore.getAll();
    if (units.length === 0) {
        setUnitsStatus('Nenhuma Unidade cadastrada neste Residencial.', { tone: 'empty' });
        return;
    }
    setUnitsStatus();
    for (const unit of units) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'predio-card';
        button.dataset.unitId = unit.id;
        button.addEventListener('click', () => openPersistedUnit(unit.id));
        const title = document.createElement('strong');
        title.textContent = unit.identification;
        const subtitle = document.createElement('span');
        subtitle.textContent = `${unit.subdivision || 'Sem subdivisão'} · ${unit.type}`;
        button.append(title, subtitle);
        list.appendChild(button);
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
        document.getElementById('persisted-unit-type').textContent = `Tipo: ${unit.type}`;
        document.getElementById('persisted-unit-status').textContent = `Estado: ${unit.status}`;
        detail.hidden = false;
        setUnitsStatus();
    } catch (error) {
        console.error('[Unidades]', error.code || error.message);
        setUnitsStatus(unitsErrorMessage(error), { retry: true, tone: 'error' });
    }
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
    document.getElementById('form-new-unit').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!selectedUnitsBuilding || !['admin', 'gerente'].includes(currentUser.role)) return;
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
        } finally {
            button.disabled = false;
        }
    });
}

window.openUnitsForBuilding = openUnitsForBuilding;
