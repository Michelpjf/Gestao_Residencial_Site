import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../src/shared/lifecycle.js', import.meta.url), 'utf8');

test('bootstrap starts authentication without removed mock generators', () => {
    assert.doesNotMatch(source, /generateMockUnits|syncMockTenantsAndContracts/);
    assert.doesNotMatch(source, /loadFromBackend|loadState|localStorage/);
    assert.ok(source.indexOf('setupForms()') < source.indexOf('setupNavigation()'));
});
