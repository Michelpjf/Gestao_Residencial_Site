/* Visão operacional de Contratos persistidos e geração DOCX no backend. */
let contractEventsReady = false;
let contractViewVersion = 0;
let selectedContractId = null;

function resetContractsView() {
    contractViewVersion += 1;
    selectedContractId = null;
    window.contractsStore.clear();
    document.getElementById('persisted-contracts-list')?.replaceChildren();
    const detail = document.getElementById('persisted-contract-detail');
    if (detail) detail.hidden = true;
}

function setContractsStatus(message = '', { retry = false, tone = 'neutral' } = {}) {
    const status = document.getElementById('contracts-status');
    status.hidden = !message;
    status.dataset.tone = tone;
    document.getElementById('contracts-status-message').textContent = message;
    document.getElementById('btn-retry-contracts').hidden = !retry;
}

function contractsErrorMessage(error) {
    if (error?.status === 401) return 'Sessão expirada. Entre novamente.';
    if (error?.status === 403) return 'Seu perfil não tem acesso a esta operação.';
    if (error?.code === 'TENANT_NOT_FOUND') return 'Morador não encontrado ou fora do seu escopo.';
    if (error?.code === 'CONTRACT_INPUT_INVALID') return 'Confira o valor, prazo e intervalo de datas.';
    return 'Não foi possível acessar os Contratos. Tente novamente.';
}

function contractNumber(contract) {
    const year = String(contract.createdAt).slice(0, 4);
    return `${String(contract.contractNumber).padStart(3, '0')}/${year}`;
}

function unitLabel(contract) {
    return `${contract.buildingName} · ${contract.unitSubdivision ? `${contract.unitSubdivision} / ` : ''}${contract.unitIdentification}`;
}

function renderPersistedContracts() {
    const list = document.getElementById('persisted-contracts-list');
    list.replaceChildren();
    const contracts = window.contractsStore.getAll();
    if (contracts.length === 0) { setContractsStatus('Nenhum Contrato cadastrado.', { tone: 'empty' }); return; }
    setContractsStatus();
    for (const contract of contracts) {
        const card = document.createElement('article');
        card.className = 'predio-card';
        const title = document.createElement('strong');
        title.textContent = `Contrato ${contractNumber(contract)} · ${contract.tenantName}`;
        const subtitle = document.createElement('span');
        subtitle.textContent = unitLabel(contract);
        const actions = document.createElement('div');
        actions.className = 'predio-card-actions';
        const detail = document.createElement('button');
        detail.type = 'button'; detail.className = 'btn-secondary'; detail.textContent = 'Ver detalhes';
        detail.addEventListener('click', () => openPersistedContract(contract.id));
        const download = document.createElement('button');
        download.type = 'button'; download.className = 'btn-primary'; download.textContent = 'Baixar DOCX';
        download.addEventListener('click', () => downloadPersistedContract(contract.id, contract));
        actions.append(detail, download); card.append(title, subtitle, actions); list.appendChild(card);
    }
}

async function refreshPersistedContracts() {
    const version = contractViewVersion;
    window.contractsStore.clear();
    document.getElementById('persisted-contracts-list').replaceChildren();
    document.getElementById('persisted-contract-detail').hidden = true;
    setContractsStatus('Carregando Contratos...');
    try { await window.contractsStore.refresh(); if (version === contractViewVersion) renderPersistedContracts(); }
    catch (error) { if (version === contractViewVersion) setContractsStatus(contractsErrorMessage(error), { retry: true, tone: 'error' }); }
}

async function openPersistedContract(id) {
    const version = contractViewVersion;
    setContractsStatus('Carregando detalhe...');
    try {
        const contract = await window.contractsStore.get(id);
        if (version !== contractViewVersion) return;
        selectedContractId = id;
        document.getElementById('persisted-contract-title').textContent = `Contrato ${contractNumber(contract)}`;
        document.getElementById('persisted-contract-tenant').textContent = `Titular: ${contract.tenantName}`;
        document.getElementById('persisted-contract-unit').textContent = `Unidade: ${unitLabel(contract)}`;
        document.getElementById('persisted-contract-values').textContent = `Aluguel: R$ ${Number(contract.rentAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · Prazo: ${contract.termMonths} mês(es) · ${contract.startDate} a ${contract.endDate}`;
        document.getElementById('persisted-contract-template').textContent = `Modelo: ${contract.templateVersion}`;
        document.getElementById('persisted-contract-detail').hidden = false;
        setContractsStatus();
    } catch (error) { setContractsStatus(contractsErrorMessage(error), { retry: true, tone: 'error' }); }
}

async function downloadPersistedContract(id, contract = null) {
    setContractsStatus('Gerando DOCX...');
    try {
        const blob = await window.contractsStore.download(id);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `contrato-temporada-${String(contract?.contractNumber || 'documento').padStart(3, '0')}.docx`;
        document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
        setContractsStatus('DOCX gerado com sucesso.', { tone: 'success' });
    } catch (error) { setContractsStatus(contractsErrorMessage(error), { tone: 'error' }); }
}

async function prepareContractForm() {
    let tenants = window.tenantsStore.getAll();
    if (tenants.length === 0) tenants = await window.tenantsStore.refresh();
    const select = document.getElementById('new-contract-tenant');
    select.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = ''; placeholder.textContent = tenants.length ? 'Selecione o Morador' : 'Nenhum Morador disponível';
    select.appendChild(placeholder);
    for (const tenant of tenants) {
        const option = document.createElement('option'); option.value = tenant.id;
        option.textContent = `${tenant.fullName} · ${tenant.buildingName} · ${tenant.unitSubdivision ? `${tenant.unitSubdivision} / ` : ''}${tenant.unitIdentification}`;
        select.appendChild(option);
    }
    select.disabled = tenants.length === 0;
}

async function initContractsTab() {
    contractViewVersion += 1;
    const canRead = ['admin', 'gerente', 'gestor', 'financeiro'].includes(currentUser.role);
    const canCreate = ['admin', 'gerente', 'gestor'].includes(currentUser.role);
    document.getElementById('form-new-contract').hidden = !canCreate;
    document.getElementById('persisted-contracts-list').hidden = !canRead;
    if (!canRead) { setContractsStatus('Seu perfil não tem acesso aos Contratos.', { tone: 'error' }); return; }
    if (!contractEventsReady) {
        contractEventsReady = true;
        document.getElementById('btn-retry-contracts').addEventListener('click', refreshPersistedContracts);
        document.getElementById('btn-close-contract-detail').addEventListener('click', () => { document.getElementById('persisted-contract-detail').hidden = true; });
        document.getElementById('btn-download-contract-detail').addEventListener('click', () => { if (selectedContractId) downloadPersistedContract(selectedContractId); });
        document.getElementById('form-new-contract').addEventListener('submit', async (event) => {
            event.preventDefault(); const button = event.currentTarget.querySelector('button[type="submit"]'); button.disabled = true;
            setContractsStatus('Persistindo Contrato...');
            try {
                await window.contractsStore.create({
                    tenantId: document.getElementById('new-contract-tenant').value,
                    rentAmount: Number(document.getElementById('new-contract-rent').value).toFixed(2),
                    termMonths: Number(document.getElementById('new-contract-months').value),
                    startDate: document.getElementById('new-contract-start').value,
                    endDate: document.getElementById('new-contract-end').value,
                });
                event.currentTarget.reset(); renderPersistedContracts(); setContractsStatus('Contrato persistido e pronto para DOCX.', { tone: 'success' });
            } catch (error) { setContractsStatus(contractsErrorMessage(error), { tone: 'error' }); }
            finally { button.disabled = false; }
        });
    }
    try { if (canCreate) await prepareContractForm(); await refreshPersistedContracts(); }
    catch (error) { setContractsStatus(contractsErrorMessage(error), { retry: true, tone: 'error' }); }
}

window.initContractsTab = initContractsTab;
window.resetContractsView = resetContractsView;
