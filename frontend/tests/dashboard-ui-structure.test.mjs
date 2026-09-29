import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/dashboard/index.js', import.meta.url), 'utf8');
const view = readFileSync(new URL('../src/dashboard/view.html', import.meta.url), 'utf8');

function element(tag = 'div') {
    return {
        tag,
        children: [],
        textContent: '',
        hidden: false,
        className: '',
        append(...children) { this.children.push(...children); },
        appendChild(child) { this.children.push(child); },
        replaceChildren(...children) { this.children = children; },
        addEventListener() {}
    };
}

function loadDashboard() {
    const elements = new Map();
    for (const id of [
        'dashboard-loading', 'dashboard-error', 'dashboard-content', 'dashboard-error-message',
        'dashboard-retry', 'stat-active-buildings', 'stat-units', 'stat-vacant-units',
        'stat-occupied-units', 'stat-scheduled-contracts', 'stat-active-contracts',
        'stat-active-tenants', 'stat-archived-tenants', 'essential-report-body', 'essential-report-empty'
    ]) elements.set(id, element());
    const document = {
        getElementById(id) { return elements.get(id) || null; },
        createElement(tag) { return element(tag); }
    };
    const context = { document, window: {}, console };
    vm.createContext(context);
    vm.runInContext(source, context);
    return { context, elements };
}

test('renders persisted totals and null links without HTML injection', () => {
    const { context, elements } = loadDashboard();
    vm.runInContext(`renderDashboardReport({
        summary: { activeBuildings: 1, units: 1, vacantUnits: 1, occupiedUnits: 0, scheduledContracts: 0, activeContracts: 0, activeTenants: 0, archivedTenants: 0 },
        rows: [{
            buildingId: 'b', buildingName: '<img src=x>', unitId: 'u',
            unitIdentification: '101', unitSubdivision: null,
            tenantId: null, tenantName: null, contractNumber: null
        }]
    })`, context);
    assert.equal(elements.get('stat-active-buildings').textContent, 1);
    assert.equal(elements.get('essential-report-body').children.length, 1);
    assert.equal(elements.get('essential-report-body').children[0].children[0].textContent, '<img src=x>');
    assert.equal(elements.get('essential-report-body').children[0].children[2].textContent, '—');
});

test('dashboard exposes loading, empty, error and retry states', () => {
    for (const id of ['dashboard-loading', 'dashboard-error', 'dashboard-content', 'dashboard-retry', 'essential-report-empty']) {
        assert.match(view, new RegExp(`id="${id}"`));
    }
    assert.match(source, /showDashboardState\('loading'\)/);
    assert.match(source, /showDashboardState\('error'\)/);
    assert.match(source, /showDashboardState\('content'\)/);
});

test('dashboard presentation has no legacy data or local persistence path', () => {
    assert.doesNotMatch(source, /BUILDINGS_DATA|UNITS_DATA|TENANTS_DATA|CONTRACTS_DATA|localStorage|innerHTML|insertAdjacentHTML/);
    assert.doesNotMatch(view, /ocupação|receita|inadimplência|vigência|CPF|RG|telefone/i);
    for (const label of ['Residenciais ativos', 'Total de Unidades', 'Vagas', 'Ocupadas', 'Contratos agendados', 'Contratos vigentes', 'Moradores ativos', 'Moradores arquivados']) {
        assert.match(view, new RegExp(label));
    }
});
