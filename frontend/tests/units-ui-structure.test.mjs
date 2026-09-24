import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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

test('persisted unit rendering uses text nodes and explicit async states', () => {
    const render = screen.slice(
        screen.indexOf('function renderPersistedUnits()'),
        screen.indexOf('async function refreshPersistedUnits()'),
    );

    assert.match(render, /textContent = unit\.identification/);
    assert.match(render, /textContent = `\$\{unit\.subdivision/);
    assert.doesNotMatch(render, /innerHTML|insertAdjacentHTML/);
    assert.match(screen, /Carregando Unidades/);
    assert.match(screen, /Nenhuma Unidade cadastrada/);
    assert.match(screen, /btn-retry-units/);
});

test('persisted unit screen does not read or synchronize legacy unit snapshots', () => {
    assert.doesNotMatch(screen, /UNITS_DATA|localStorage|saveState|loadFromBackend/);
    assert.doesNotMatch(state, /fetch\(`\$\{API_URL\}\/units/);
});
