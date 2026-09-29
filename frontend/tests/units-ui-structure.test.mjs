import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const [view, screen, state] = await Promise.all([
    readFile(new URL('../src/buildings/view.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/units/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/shared/state.js', import.meta.url), 'utf8'),
]);

test('unit form contains only the approved persisted fields', () => {
    const form = view.slice(view.indexOf('<form id="form-new-unit"'), view.indexOf('</form>', view.indexOf('<form id="form-new-unit"')));

    assert.match(form, /new-unit-identification/);
    assert.match(form, /new-unit-subdivision/);
    assert.match(form, /new-unit-type/);
    assert.doesNotMatch(form, /rent|garage|tenant|occupied|reservation/);
});

test('batch form exposes generation inputs and a preview without manual occupancy', () => {
    const form = view.slice(view.indexOf('<form id="form-new-units-batch"'), view.indexOf('</form>', view.indexOf('<form id="form-new-units-batch"')));
    for (const field of ['batch-unit-subdivision', 'batch-unit-type', 'batch-unit-quantity', 'batch-unit-start', 'batch-unit-suffix', 'batch-unit-preview']) {
        assert.match(form, new RegExp(field));
    }
    assert.doesNotMatch(form, /occupied|status|tenant|contract/);
    assert.match(screen, /createBatch\(buildingId, units\)/);
    assert.match(screen, /Array\.from\(\{ length: quantity \}/);
});

test('persisted unit rendering uses text nodes and explicit async states', () => {
    const render = screen.slice(
        screen.indexOf('function renderPersistedUnits()'),
        screen.indexOf('async function refreshPersistedUnits()'),
    );

    assert.match(render, /textContent = unit\.identification/);
    assert.match(render, /heading\.textContent = subdivision/);
    assert.doesNotMatch(render, /innerHTML|insertAdjacentHTML/);
    assert.match(screen, /Carregando Unidades/);
    assert.match(screen, /Nenhuma Unidade cadastrada/);
    assert.match(screen, /btn-retry-units/);
    assert.match(view, /persisted-unit-occupancy/);
    assert.match(render, /unit\.currentTenantName/);
    assert.match(screen, /unit\.currentContractNumber/);
    assert.match(view, /units-search/);
    assert.match(view, /units-status-filter/);
    assert.match(view, /units-type-filter/);
    assert.match(view, /persisted-unit-scheduled/);
    assert.match(render, /unit-map-group/);
    assert.match(screen, /priority\[left\.status\]/);
});

test('persisted unit screen does not read or synchronize legacy unit snapshots', () => {
    assert.doesNotMatch(screen, /UNITS_DATA|localStorage|saveState|loadFromBackend/);
    assert.doesNotMatch(state, /fetch\(`\$\{API_URL\}\/units/);
});

test('unit filters preserve occupied, scheduled and vacant priority', () => {
    const controls = {
        'units-search': { value: '' }, 'units-status-filter': { value: 'all' }, 'units-type-filter': { value: 'all' },
    };
    const context = {
        window: { unitsStore: { getAll: () => [
            { id: 'vacant', identification: '3j', status: 'vago', type: 'loft' },
            { id: 'scheduled', identification: '2j', status: 'agendado', type: 'quarto' },
            { id: 'occupied', identification: '1j', status: 'ocupado', type: 'quarto' },
        ] } },
        document: { getElementById: (id) => controls[id] },
    };
    vm.createContext(context);
    vm.runInContext(screen, context);
    assert.deepEqual(Array.from(vm.runInContext('filteredUnits().map(unit => unit.id)', context)), ['occupied', 'scheduled', 'vacant']);
    controls['units-search'].value = '2';
    controls['units-status-filter'].value = 'agendado';
    assert.deepEqual(Array.from(vm.runInContext('filteredUnits().map(unit => unit.id)', context)), ['scheduled']);
});
