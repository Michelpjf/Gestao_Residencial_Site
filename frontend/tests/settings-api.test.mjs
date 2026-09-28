import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/settings/api.js', import.meta.url), 'utf8');

class ApiError extends Error {
    constructor(message, options = {}) {
        super(message);
        Object.assign(this, options);
    }
}

function factory(client) {
    const window = { ApiError, apiClient: client };
    vm.runInNewContext(source, { window });
    return window.createSettingsAssignmentsApi(client);
}

test('maps list and update to the persisted manager assignments API', async () => {
    const calls = [];
    const assignment = { userId: 'manager', displayName: 'Gestor', building: { id: 'building' } };
    const client = {
        get: async (path) => { calls.push(['get', path]); return { data: [assignment] }; },
        patch: async (path, body) => { calls.push(['patch', path, body]); return { data: assignment }; },
    };
    const api = factory(client);

    assert.equal((await api.list()).length, 1);
    await api.update('manager', { displayName: 'Gestor', buildingId: 'building' });
    assert.equal(JSON.stringify(calls), JSON.stringify([
        ['get', '/admin/manager-assignments'],
        ['patch', '/admin/manager-assignments/manager', { displayName: 'Gestor', buildingId: 'building' }],
    ]));
});

test('rejects malformed list responses', async () => {
    await assert.rejects(factory({ get: async () => ({ data: {} }) }).list(), {
        code: 'INVALID_MANAGER_ASSIGNMENTS_RESPONSE',
    });
});
