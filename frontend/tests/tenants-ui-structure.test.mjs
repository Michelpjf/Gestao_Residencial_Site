import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [view, screen, state, bootstrap] = await Promise.all([
    readFile(new URL('../src/tenants/view.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/tenants/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/shared/state.js', import.meta.url), 'utf8'),
    readFile(new URL('../app.js', import.meta.url), 'utf8'),
]);

test('tenant form contains the contract fields and no financial or upload fields', () => {
    const form = view.slice(view.indexOf('<form id="form-new-tenant"'), view.indexOf('</form>', view.indexOf('<form id="form-new-tenant"')));
    for (const field of ['new-tenant-unit', 'new-tenant-name', 'new-tenant-cpf', 'new-tenant-rg', 'new-tenant-birth-date',
        'new-tenant-marital-status', 'new-tenant-address-goiania', 'new-tenant-address-origin', 'new-tenant-phone',
        'new-tenant-reference-one-name', 'new-tenant-reference-two-name', 'new-tenant-occupation']) assert.match(form, new RegExp(field));
    assert.doesNotMatch(form, /income|rent|payment|upload|document-file/);
});

test('tenant rendering uses safe text nodes and explicit async states', () => {
    assert.match(screen, /textContent = tenant\.fullName/);
    assert.doesNotMatch(screen, /innerHTML|insertAdjacentHTML/);
    assert.match(screen, /Carregando Moradores/);
    assert.match(screen, /Nenhum Morador cadastrado/);
    assert.match(screen, /btn-retry-tenants/);
    assert.match(screen, /\['admin', 'gerente', 'gestor'\]/);
});

test('persisted tenant screen does not use or synchronize legacy tenant snapshots', () => {
    assert.doesNotMatch(screen, /TENANTS_DATA|localStorage|saveState|loadFromBackend/);
    assert.doesNotMatch(state, /fetch\(`\$\{API_URL\}\/tenants/);
    assert.match(bootstrap, /tenants\/api\.js/);
});
