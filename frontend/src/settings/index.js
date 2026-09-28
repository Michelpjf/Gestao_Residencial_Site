/* Administração persistida do escopo de Gestores. */
(function exposeSettings(globalObject) {
    'use strict';

    let initialized = false;

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function setStatus(message, kind = 'info') {
        const status = document.getElementById('manager-assignments-status');
        const text = document.getElementById('manager-assignments-status-message');
        if (!status || !text) return;
        status.hidden = !message;
        status.className = `buildings-status status-${kind}`;
        text.textContent = message || '';
    }

    function formatDate(value) {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    }

    function createManagerRow(assignment, buildings) {
        const row = document.createElement('tr');
        const managerCell = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.className = 'manager-name-input';
        nameInput.type = 'text';
        nameInput.maxLength = 160;
        nameInput.required = true;
        nameInput.value = assignment.displayName || `Gestor ${assignment.userId.slice(0, 8)}`;
        nameInput.setAttribute('aria-label', 'Nome de exibição do Gestor');
        managerCell.append(nameInput, element('small', 'manager-id', `ID interno ${assignment.userId.slice(0, 8)}`));

        const buildingCell = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'manager-building-select';
        select.setAttribute('aria-label', `Residencial autorizado para ${nameInput.value}`);
        buildings.forEach((building) => {
            const option = document.createElement('option');
            option.value = building.id;
            option.textContent = building.name;
            option.selected = building.id === assignment.building.id;
            select.appendChild(option);
        });
        buildingCell.appendChild(select);

        const updatedCell = element('td', 'manager-updated-at', formatDate(assignment.updatedAt));
        const actionCell = document.createElement('td');
        const saveButton = element('button', 'btn-primary manager-assignment-save', 'Salvar vínculo');
        saveButton.type = 'button';
        saveButton.dataset.userId = assignment.userId;
        actionCell.appendChild(saveButton);

        row.append(managerCell, buildingCell, updatedCell, actionCell);
        return row;
    }

    async function loadConfigData() {
        const body = document.getElementById('manager-assignments-body');
        const empty = document.getElementById('manager-assignments-empty');
        const retry = document.getElementById('btn-retry-manager-assignments');
        if (!body || !empty || !retry) return;

        body.replaceChildren();
        empty.hidden = true;
        retry.hidden = true;
        setStatus('Carregando vínculos persistidos…');

        try {
            const [assignments, buildings] = await Promise.all([
                globalObject.settingsAssignmentsApi.list(),
                globalObject.buildingsStore.refresh(),
            ]);
            setStatus('');
            if (assignments.length === 0) {
                empty.hidden = false;
                return;
            }
            assignments.forEach((assignment) => body.appendChild(createManagerRow(assignment, buildings)));
        } catch (error) {
            setStatus('Não foi possível carregar os Gestores e residenciais. Tente novamente.', 'error');
            retry.hidden = false;
            console.error('Manager assignments could not be loaded', error);
        }
    }

    async function saveAssignment(button) {
        const row = button.closest('tr');
        const nameInput = row?.querySelector('.manager-name-input');
        const buildingSelect = row?.querySelector('.manager-building-select');
        if (!row || !nameInput || !buildingSelect) return;

        const displayName = nameInput.value.trim();
        if (displayName.length < 2) {
            setStatus('Informe um nome de exibição com pelo menos 2 caracteres.', 'error');
            nameInput.focus();
            return;
        }

        button.disabled = true;
        button.textContent = 'Salvando…';
        setStatus('Salvando vínculo no banco da aplicação…');
        try {
            await globalObject.settingsAssignmentsApi.update(button.dataset.userId, {
                displayName,
                buildingId: buildingSelect.value,
            });
            await loadConfigData();
            setStatus('Vínculo atualizado e registrado na auditoria.', 'success');
        } catch (error) {
            setStatus('Não foi possível salvar o vínculo. Confirme os dados e tente novamente.', 'error');
            button.disabled = false;
            button.textContent = 'Salvar vínculo';
            console.error('Manager assignment could not be saved', error);
        }
    }

    function setupConfigTabs() {
        if (initialized) return;
        initialized = true;
        document.getElementById('btn-retry-manager-assignments')?.addEventListener('click', loadConfigData);
        document.getElementById('manager-assignments-body')?.addEventListener('click', (event) => {
            const button = event.target.closest('.manager-assignment-save');
            if (button) saveAssignment(button);
        });
    }

    globalObject.setupConfigTabs = setupConfigTabs;
    globalObject.loadConfigData = loadConfigData;
})(window);
