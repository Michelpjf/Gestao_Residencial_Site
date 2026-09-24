import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/units/api.js', import.meta.url), 'utf8');

class ApiError extends Error {
    constructor(message, options = {}) {
        super(message);
        Object.assign(this, options);
    }
}

function loadFactories(apiClient = {}) {
    const window = { ApiError, apiClient };
    vm.runInNewContext(source, { window });
    return window;
}

test('maps unit endpoints and sends only approved creation fields', async () => {
    const calls = [];
    const unit = { id: 'unit-1', buildingId: 'building-1', identification: '101', type: 'quarto' };
    const client = {
        get: async (path) => {
            calls.push(['get', path]);
            return { data: path.includes('/buildings/') ? [unit] : unit };
        },
        post: async (path, body) => {
            calls.push(['post', path, body]);
            return { data: unit };
        },
    };
    const { createUnitsApi } = loadFactories(client);
    const api = createUnitsApi(client);

    assert.deepEqual(await api.list('building-1'), [unit]);
    assert.deepEqual(await api.get('unit-1'), unit);
    assert.deepEqual(await api.create('building-1', {
        identification: '101', subdivision: '', type: 'quarto', status: 'ocupado',
    }), unit);
    assert.equal(JSON.stringify(calls), JSON.stringify([
        ['get', '/buildings/building-1/units'],
        ['get', '/units/unit-1'],
        ['post', '/buildings/building-1/units', {
            identification: '101', subdivision: null, type: 'quarto',
        }],
    ]));
});

test('refreshes the persisted list after creation', async () => {
    const calls = [];
    const api = {
        list: async (buildingId) => {
            calls.push(['list', buildingId]);
            return [{ id: 'unit-1', buildingId }];
        },
        create: async (buildingId, input) => calls.push(['create', buildingId, input]),
    };
    const { createUnitsStore } = loadFactories();
    const store = createUnitsStore(api);

    await store.create('building-1', { identification: '101', type: 'quarto' });

    assert.deepEqual(store.getAll(), [{ id: 'unit-1', buildingId: 'building-1' }]);
    assert.equal(JSON.stringify(calls), JSON.stringify([
        ['create', 'building-1', { identification: '101', type: 'quarto' }],
        ['list', 'building-1'],
    ]));
});

test('rejects a malformed list response', async () => {
    const client = { get: async () => ({ data: {} }) };
    const { createUnitsApi } = loadFactories(client);

    await assert.rejects(createUnitsApi(client).list('building-1'), {
        code: 'INVALID_UNITS_RESPONSE',
    });
});
