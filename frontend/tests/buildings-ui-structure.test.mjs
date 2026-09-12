import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [view, screen, navigation, state] = await Promise.all([
    readFile(new URL('../src/buildings/view.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/buildings/index.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/shared/navigation.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/shared/state.js', import.meta.url), 'utf8'),
]);

test('residential form exposes only fields persisted by the current API', () => {
    const form = view.slice(view.indexOf('<form id="form-new-building">'), view.indexOf('</form>'));

    assert.match(form, /id="new-building-name"/);
    assert.doesNotMatch(form, /new-building-(units|manager|start-num|suffix|subdivisions)/);
    assert.match(view, /id="buildings-status"/);
    assert.match(view, /id="btn-retry-buildings"/);
});

test('residential list uses the API store and renders names as text', () => {
    const listFunction = screen.slice(
        screen.indexOf('function loadBuildingsGrid()'),
        screen.indexOf('function viewBuildingDetail'),
    );

    assert.match(listFunction, /window\.buildingsStore\.getAll\(\)/);
    assert.match(listFunction, /title\.textContent = building\.name/);
    assert.doesNotMatch(listFunction, /BUILDINGS_DATA|innerHTML|insertAdjacentHTML/);
    assert.match(navigation, /loadBuildingsFromApi\(\)/);
});

test('legacy snapshot synchronization no longer calls the buildings endpoint', () => {
    assert.doesNotMatch(state, /fetch\(`\$\{API_URL\}\/buildings/);
});
