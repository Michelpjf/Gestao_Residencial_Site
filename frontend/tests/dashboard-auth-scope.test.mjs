import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/dashboard/index.js', import.meta.url), 'utf8');

function renderDashboard(role, buildingId) {
    const elements = new Map();
    const document = {
        getElementById(id) {
            if (!elements.has(id)) {
                elements.set(id, {
                    textContent: '', innerHTML: '', style: {},
                    insertAdjacentHTML() {}
                });
            }
            return elements.get(id);
        }
    };
    const context = {
        document,
        currentUser: { role, buildingId },
        BUILDINGS_DATA: [{ id: 'bloco-a', name: 'Bloco A', units: 10, occupied: 5, rate: 50, manager: 'Teste' }],
        CONTRACTS_DATA: [], UNITS_DATA: [], TENANTS_DATA: []
    };
    vm.createContext(context);
    vm.runInContext(source, context);
    vm.runInContext('loadDashboardData()', context);
    return id => document.getElementById(id);
}

test('Gestor with a persisted building ID can open the dashboard without matching legacy mocks', () => {
    const element = renderDashboard('gestor', '4a55be04-e468-41b1-944c-ad475a729b20');
    assert.equal(element('stat-occupancy').textContent, '—');
    assert.equal(element('stat-contracts').textContent, '—');
    assert.equal(element('building-count-badge').textContent, '0 Prédio(s)');
});

test('existing local dashboard figures still render when a building matches', () => {
    const element = renderDashboard('gestor', 'bloco-a');
    assert.equal(element('stat-occupancy').textContent, '50.0%');
    assert.equal(element('stat-contracts').textContent, 5);
});
