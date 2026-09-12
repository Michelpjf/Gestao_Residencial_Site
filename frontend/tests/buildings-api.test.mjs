import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/buildings/api.js', import.meta.url), 'utf8');

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

test('maps the buildings endpoints and sends only the persisted name', async () => {
    const calls = [];
    const building = { id: 'building-1', name: 'Residencial Bueno', active: true };
    const client = {
        get: async (path) => {
            calls.push(['get', path]);
            return { data: [building] };
        },
        post: async (path, body) => {
            calls.push(['post', path, body]);
            return { data: building };
        },
        patch: async (path, body) => {
            calls.push(['patch', path, body]);
            return { data: building };
        },
        delete: async (path) => {
            calls.push(['delete', path]);
            return { data: { ...building, active: false } };
        },
    };
    const { createBuildingsApi } = loadFactories(client);
    const api = createBuildingsApi(client);

    assert.deepEqual(await api.list(), [building]);
    assert.deepEqual(await api.create('Residencial Bueno'), building);
    assert.deepEqual(await api.update('building-1', 'Novo Nome'), building);
    assert.equal((await api.deactivate('building-1')).active, false);
    assert.equal(JSON.stringify(calls), JSON.stringify([
        ['get', '/buildings'],
        ['post', '/buildings', { name: 'Residencial Bueno' }],
        ['patch', '/buildings/building-1', { name: 'Novo Nome' }],
        ['delete', '/buildings/building-1'],
    ]));
});

test('rejects responses that do not follow the backend contract', async () => {
    const client = { get: async () => [] };
    const { createBuildingsApi } = loadFactories(client);

    await assert.rejects(createBuildingsApi(client).list(), { code: 'INVALID_BUILDINGS_RESPONSE' });
});

test('refreshes from the API after every mutation instead of trusting local state', async () => {
    const snapshots = [
        [{ id: 'building-1', name: 'Primeiro' }],
        [{ id: 'building-1', name: 'Primeiro' }, { id: 'building-2', name: 'Segundo' }],
        [{ id: 'building-1', name: 'Renomeado' }, { id: 'building-2', name: 'Segundo' }],
        [{ id: 'building-1', name: 'Renomeado' }],
    ];
    const calls = [];
    const api = {
        list: async () => {
            calls.push('list');
            return snapshots.shift();
        },
        create: async (name) => calls.push(['create', name]),
        update: async (id, name) => calls.push(['update', id, name]),
        deactivate: async (id) => calls.push(['deactivate', id]),
    };
    const { createBuildingsStore } = loadFactories();
    const store = createBuildingsStore(api);

    await store.refresh();
    await store.create('Segundo');
    await store.update('building-1', 'Renomeado');
    await store.deactivate('building-2');

    assert.deepEqual(store.getAll(), [{ id: 'building-1', name: 'Renomeado' }]);
    assert.deepEqual(calls, [
        'list',
        ['create', 'Segundo'],
        'list',
        ['update', 'building-1', 'Renomeado'],
        'list',
        ['deactivate', 'building-2'],
        'list',
    ]);
});
