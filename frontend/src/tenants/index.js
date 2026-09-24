/* Visão operacional de Moradores persistidos. */
let tenantEventsReady = false;
let tenantViewVersion = 0;

function resetTenantsView() {
    tenantViewVersion += 1;
    window.tenantsStore.clear();
    document.getElementById('persisted-tenants-list')?.replaceChildren();
    const detail = document.getElementById('persisted-tenant-detail');
    if (detail) detail.hidden = true;
}
function setTenantsStatus(message = '', { retry = false, tone = 'neutral' } = {}) {
    const status = document.getElementById('tenants-status');
    status.hidden = !message;
    status.dataset.tone = tone;
    document.getElementById('tenants-status-message').textContent = message;
    document.getElementById('btn-retry-tenants').hidden = !retry;
}

function tenantsErrorMessage(error) {
    if (error?.status === 401) return 'Sessão expirada. Entre novamente.';
    if (error?.status === 403) return 'Seu perfil não tem acesso aos Moradores.';
    if (error?.code === 'TENANT_CPF_CONFLICT') return 'Já existe um Morador cadastrado com esse CPF.';
    if (error?.code === 'TENANT_INPUT_INVALID') return 'Confira os campos obrigatórios e o CPF informado.';
    if (error?.code === 'UNIT_NOT_FOUND') return 'Unidade não encontrada, inativa ou fora do seu escopo.';
    return 'Não foi possível acessar os Moradores. Tente novamente.';
}

function formatCpf(cpf) {
    return String(cpf).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

function renderPersistedTenants() {
    const list = document.getElementById('persisted-tenants-list');
    list.replaceChildren();
    const tenants = window.tenantsStore.getAll();
    if (tenants.length === 0) {
        setTenantsStatus('Nenhum Morador cadastrado.', { tone: 'empty' });
        return;
    }
    setTenantsStatus();
    for (const tenant of tenants) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'predio-card';
        button.dataset.tenantId = tenant.id;
        button.addEventListener('click', () => openPersistedTenant(tenant.id));
        const title = document.createElement('strong');
        title.textContent = tenant.fullName;
        const subtitle = document.createElement('span');
        subtitle.textContent = `${tenant.buildingName} · ${tenant.unitSubdivision ? `${tenant.unitSubdivision} / ` : ''}${tenant.unitIdentification}`;
        button.append(title, subtitle);
        list.appendChild(button);
    }
}

async function refreshPersistedTenants() {
    const version = tenantViewVersion;
    window.tenantsStore.clear();
    document.getElementById('persisted-tenants-list').replaceChildren();
    document.getElementById('persisted-tenant-detail').hidden = true;
    setTenantsStatus('Carregando Moradores...');
    try {
        await window.tenantsStore.refresh();
        if (version !== tenantViewVersion) return;
        renderPersistedTenants();
    } catch (error) {
        console.error('[Moradores]', error.code || error.message);
        setTenantsStatus(tenantsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

async function openPersistedTenant(id) {
    const version = tenantViewVersion;
    const detail = document.getElementById('persisted-tenant-detail');
    detail.hidden = true;
    setTenantsStatus('Carregando detalhe...');
    try {
        const tenant = await window.tenantsStore.get(id);
        if (version !== tenantViewVersion) return;
        document.getElementById('persisted-tenant-name').textContent = tenant.fullName;
        document.getElementById('persisted-tenant-document').textContent = `CPF: ${formatCpf(tenant.cpf)} · RG: ${tenant.rg}`;
        document.getElementById('persisted-tenant-birth').textContent = `Nascimento: ${tenant.birthDate} · Estado civil: ${tenant.maritalStatus}`;
        document.getElementById('persisted-tenant-contact').textContent = `Telefone: ${tenant.phone}`;
        document.getElementById('persisted-tenant-addresses').textContent = `Endereços: ${tenant.addressGoiania} · Origem: ${tenant.addressOrigin}`;
        document.getElementById('persisted-tenant-references').textContent = `Referências: ${tenant.referenceOneName} (${tenant.referenceOnePhone}) · ${tenant.referenceTwoName} (${tenant.referenceTwoPhone})`;
        document.getElementById('persisted-tenant-unit').textContent = `Unidade: ${tenant.buildingName} · ${tenant.unitSubdivision ? `${tenant.unitSubdivision} / ` : ''}${tenant.unitIdentification}`;
        document.getElementById('persisted-tenant-occupation').textContent = `Empresa/instituição: ${tenant.occupationInstitution || 'Não informada'} · Telefone comercial: ${tenant.commercialPhone || 'Não informado'} · Endereço comercial: ${tenant.commercialAddress || 'Não informado'}`;
        detail.hidden = false;
        setTenantsStatus();
    } catch (error) {
        console.error('[Moradores]', error.code || error.message);
        setTenantsStatus(tenantsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

async function loadTenantUnits() {
    const buildingId = document.getElementById('new-tenant-building').value;
    const select = document.getElementById('new-tenant-unit');
    select.replaceChildren();
    select.disabled = true;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = buildingId ? 'Carregando Unidades...' : 'Selecione o Residencial';
    select.appendChild(placeholder);
    if (!buildingId) return;
    try {
        const units = await window.unitsStore.refresh(buildingId);
        placeholder.textContent = units.length ? 'Selecione a Unidade' : 'Nenhuma Unidade disponível';
        for (const unit of units) {
            const option = document.createElement('option');
            option.value = unit.id;
            option.textContent = `${unit.subdivision ? `${unit.subdivision} / ` : ''}${unit.identification}`;
            select.appendChild(option);
        }
        select.disabled = units.length === 0;
    } catch (error) {
        console.error('[Moradores]', error.code || error.message);
        setTenantsStatus(tenantsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

async function prepareTenantForm() {
    const select = document.getElementById('new-tenant-building');
    select.replaceChildren();
    const buildings = await window.buildingsStore.refresh();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selecione o Residencial';
    select.appendChild(placeholder);
    for (const building of buildings) {
        const option = document.createElement('option');
        option.value = building.id;
        option.textContent = building.name;
        select.appendChild(option);
    }
    if (buildings.length === 1) { select.value = buildings[0].id; await loadTenantUnits(); }
}

function tenantInputFromForm() {
    const value = (id) => document.getElementById(id).value;
    return {
        unitId: value('new-tenant-unit'), fullName: value('new-tenant-name'), cpf: value('new-tenant-cpf'), rg: value('new-tenant-rg'),
        birthDate: value('new-tenant-birth-date'), maritalStatus: value('new-tenant-marital-status'), addressGoiania: value('new-tenant-address-goiania'),
        addressOrigin: value('new-tenant-address-origin'), phone: value('new-tenant-phone'), referenceOneName: value('new-tenant-reference-one-name'),
        referenceOnePhone: value('new-tenant-reference-one-phone'), referenceTwoName: value('new-tenant-reference-two-name'),
        referenceTwoPhone: value('new-tenant-reference-two-phone'), occupationInstitution: value('new-tenant-occupation'),
        commercialPhone: value('new-tenant-commercial-phone'), commercialAddress: value('new-tenant-commercial-address'),
    };
}

async function initTenantsTab() {
    tenantViewVersion += 1;
    const allowed = ['admin', 'gerente', 'gestor'].includes(currentUser.role);
    document.getElementById('form-new-tenant').hidden = !allowed;
    document.getElementById('persisted-tenants-list').hidden = !allowed;
    if (!allowed) { setTenantsStatus('Seu perfil não tem acesso aos Moradores.', { tone: 'error' }); return; }
    if (!tenantEventsReady) {
        tenantEventsReady = true;
        document.getElementById('btn-retry-tenants').addEventListener('click', refreshPersistedTenants);
        document.getElementById('btn-close-tenant-detail').addEventListener('click', () => { document.getElementById('persisted-tenant-detail').hidden = true; });
        document.getElementById('new-tenant-building').addEventListener('change', loadTenantUnits);
        document.getElementById('form-new-tenant').addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = event.currentTarget.querySelector('button[type="submit"]');
        button.disabled = true;
        setTenantsStatus('Cadastrando Morador...');
        try {
            await window.tenantsStore.create(tenantInputFromForm());
            event.currentTarget.reset();
            document.getElementById('new-tenant-unit').disabled = true;
            renderPersistedTenants();
            setTenantsStatus('Morador cadastrado com sucesso.', { tone: 'success' });
        } catch (error) {
            console.error('[Moradores]', error.code || error.message);
            setTenantsStatus(tenantsErrorMessage(error), { tone: 'error' });
        } finally { button.disabled = false; }
        });
    }
    try {
        await Promise.all([prepareTenantForm(), refreshPersistedTenants()]);
    } catch (error) {
        console.error('[Moradores]', error.code || error.message);
        setTenantsStatus(tenantsErrorMessage(error), { retry: true, tone: 'error' });
    }
}

window.initTenantsTab = initTenantsTab;
window.resetTenantsView = resetTenantsView;
