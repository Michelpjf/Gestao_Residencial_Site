import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [view, screen, state, bootstrap, auth] = await Promise.all([
    readFile(new URL('../src/contracts/view.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/contracts/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/shared/state.js', import.meta.url), 'utf8'),
    readFile(new URL('../app.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/auth/index.js', import.meta.url), 'utf8'),
]);

test('contract form contains only the approved persisted input fields', () => {
    const form = view.slice(view.indexOf('<form id="form-new-contract"'), view.indexOf('</form>', view.indexOf('<form id="form-new-contract"')));
    for (const field of ['new-contract-tenant', 'new-contract-rent', 'new-contract-months', 'new-contract-start', 'new-contract-end']) assert.match(form, new RegExp(field));
    assert.doesNotMatch(form, /signature|upload|pdf|guarantor|clauses|building/);
});

test('contract UI uses safe text rendering, explicit states and approved RBAC', () => {
    assert.match(screen, /textContent = `Contrato/);
    assert.doesNotMatch(screen, /innerHTML|insertAdjacentHTML|CONTRACTS_DATA|localStorage|docxtemplater|PizZip/);
    assert.match(screen, /Carregando Contratos/); assert.match(screen, /Nenhum Contrato cadastrado/); assert.match(screen, /Preparando documento/);
    assert.match(screen, /\['admin', 'gerente', 'gestor', 'financeiro'\]/);
    assert.match(screen, /const canCreate = \['gerente', 'gestor'\]/);
    assert.match(view, /persisted-contract-status/);
    assert.match(screen, /CONTRACT_PERIOD_CONFLICT/);
    assert.match(screen, /contractStatusLabel/);
    assert.match(view, /contracts-search/);
    assert.match(view, /contracts-status-filter/);
    assert.match(screen, /formatContractDate/);
    assert.match(screen, /formatContractCurrency/);
    assert.match(screen, /tenantsStore\.list\('active'\)/);
    assert.doesNotMatch(view, /temporada-v1|DOCX|persistid/i);
    assert.doesNotMatch(screen, /Modelo:.*templateVersion|Gerando DOCX|Contrato persistido/i);
    const filter = screen.slice(screen.indexOf('function filteredContracts()'), screen.indexOf('function renderPersistedContracts()'));
    assert.match(filter, /contract\.tenantName/);
    assert.match(filter, /contract\.unitIdentification/);
    assert.match(filter, /contract\.status/);
});

test('persisted contracts load after authenticated context and do not use legacy snapshot sync', () => {
    assert.doesNotMatch(state, /fetch\(`\$\{API_URL\}\/contracts/);
    assert.match(bootstrap, /contracts\/api\.js/);
    assert.match(auth, /await initContractsTab\(\)/);
    assert.match(auth, /resetContractsView\(\)/);
});

test('contract submission keeps the form reference across the async request', () => {
    assert.match(screen, /const form = event\.currentTarget;/);
    assert.match(screen, /await window\.contractsStore\.create[\s\S]*form\.reset\(\)/);
    assert.doesNotMatch(screen, /await window\.contractsStore\.create[\s\S]*event\.currentTarget\.reset\(\)/);
});
