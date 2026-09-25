import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/contracts/api.js', import.meta.url), 'utf8');
class ApiError extends Error { constructor(message, options = {}) { super(message); Object.assign(this, options); } }
function factories(apiClient = {}) { const window = { ApiError, apiClient }; vm.runInNewContext(source, { window }); return window; }

test('maps contract endpoints and strips unapproved creation fields', async () => {
    const calls = []; const contract = { id: 'contract-1' };
    const client = {
        get: async (path) => { calls.push(['get', path]); return { data: path === '/contracts' ? [contract] : contract }; },
        post: async (path, body) => { calls.push(['post', path, body]); return { data: contract }; },
        getBlob: async (path) => { calls.push(['blob', path]); return 'blob'; },
    };
    const api = factories(client).createContractsApi(client);
    const input = { tenantId: 'tenant-1', rentAmount: '1200.00', termMonths: 3, startDate: '2026-10-01', endDate: '2027-01-01', buildingId: 'forged', templateVersion: 'forged' };
    assert.deepEqual(await api.list(), [contract]); assert.deepEqual(await api.get('contract-1'), contract);
    assert.deepEqual(await api.create(input), contract); assert.equal(await api.download('contract-1'), 'blob');
    assert.equal(JSON.stringify(calls), JSON.stringify([
        ['get', '/contracts'], ['get', '/contracts/contract-1'],
        ['post', '/contracts', { tenantId: 'tenant-1', rentAmount: '1200.00', termMonths: 3, startDate: '2026-10-01', endDate: '2027-01-01' }],
        ['blob', '/contracts/contract-1/document'],
    ]));
});

test('refreshes after creation and rejects malformed lists', async () => {
    const calls = []; const api = { create: async () => calls.push('create'), list: async () => { calls.push('list'); return [{ id: 'contract-1' }]; } };
    const store = factories().createContractsStore(api); await store.create({});
    assert.deepEqual(calls, ['create', 'list']); assert.deepEqual(store.getAll(), [{ id: 'contract-1' }]);
    const malformedClient = { get: async () => ({ data: {} }) };
    await assert.rejects(factories(malformedClient).createContractsApi(malformedClient).list(), { code: 'INVALID_CONTRACTS_RESPONSE' });
});
