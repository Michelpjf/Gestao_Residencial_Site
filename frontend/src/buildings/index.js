/* Tela de Residenciais alimentada exclusivamente pela API. */
let editingBuildingId = null;

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
    if (error?.status === 403) return 'Você não tem permissão para realizar esta operação.';
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
        );
        header.append(identity, actions);

        const description = document.createElement('p');
        description.className = 'subtab-desc building-persistence-note';
        description.textContent = 'Consulte e gerencie as unidades deste residencial.';
        const viewUnits = createBuildingAction(
            'Ver Unidades',
            'view-btn',
            `Ver Unidades de ${building.name}`,
            () => window.openUnitsForBuilding(building),
        );
        card.append(header, description, viewUnits);
        container.appendChild(card);
    });
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

function editBuilding(buildingId) {
    const building = window.buildingsStore.getAll().find((item) => item.id === buildingId);
    if (!building) return;

    editingBuildingId = buildingId;
    const formCard = document.getElementById('building-form-card');
    const toggleFormButton = document.getElementById('btn-toggle-building-form');
    formCard?.classList.add('active');
    toggleFormButton?.classList.add('btn-active');
    document.getElementById('new-building-name').value = building.name;

    const title = formCard?.querySelector('h4');
    const submitButton = formCard?.querySelector('button[type="submit"]');
    if (title) title.textContent = 'Editar Residencial';
    if (submitButton) submitButton.textContent = 'Atualizar Residencial';
    formCard?.scrollIntoView({ behavior: 'smooth' });
}

function setupBuildingsEvents() {
    const toggleFormButton = document.getElementById('btn-toggle-building-form');
    const formCard = document.getElementById('building-form-card');
    const cancelFormButton = document.getElementById('btn-cancel-building');
    const form = document.getElementById('form-new-building');

    toggleFormButton?.addEventListener('click', () => {
        if (formCard?.classList.contains('active')) resetBuildingForm();
        else {
            formCard?.classList.add('active');
            toggleFormButton.classList.add('btn-active');
            document.getElementById('new-building-name')?.focus();
        }
    });
    cancelFormButton?.addEventListener('click', resetBuildingForm);
    document.getElementById('btn-retry-buildings')?.addEventListener('click', loadBuildingsFromApi);

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('new-building-name');
        const submitButton = form.querySelector('button[type="submit"]');
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
                wasEditing ? 'Residencial atualizado.' : 'Residencial cadastrado.',
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
