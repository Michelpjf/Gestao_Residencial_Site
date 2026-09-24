import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/tenants/api.js', import.meta.url), 'utf8');
class ApiError extends Error { constructor(message, options = {}) { super(message); Object.assign(this, options); } }
function loadFactories(apiClient = {}) { const window = { ApiError, apiClient }; vm.runInNewContext(source, { window }); return window; }

test('maps tenant endpoints and sends only approved fields', async () => {
    const calls = [];
    const tenant = { id: 'tenant-1', fullName: 'Pessoa Fictícia' };
    const client = {
        get: async (path) => { calls.push(['get', path]); return { data: path === '/tenants' ? [tenant] : tenant }; },
        post: async (path, body) => { calls.push(['post', path, body]); return { data: tenant }; },
    };
    const api = loadFactories(client).createTenantsApi(client);
    const input = {
        unitId: 'unit-1', fullName: 'Pessoa Fictícia', cpf: '52998224725', rg: '123', birthDate: '1990-05-10',
        maritalStatus: 'Solteiro', addressGoiania: 'A', addressOrigin: 'B', phone: '1', referenceOneName: 'R1',
        referenceOnePhone: '2', referenceTwoName: 'R2', referenceTwoPhone: '3', occupationInstitution: '',
        commercialPhone: '', commercialAddress: '', buildingId: 'forged', role: 'admin',
    };
    assert.deepEqual(await api.list(), [tenant]);
    assert.deepEqual(await api.get('tenant-1'), tenant);
    assert.deepEqual(await api.create(input), tenant);
    assert.equal(JSON.stringify(calls), JSON.stringify([
        ['get', '/tenants'], ['get', '/tenants/tenant-1'],
        ['post', '/tenants', { ...input, occupationInstitution: null, commercialPhone: null, commercialAddress: null, buildingId: undefined, role: undefined }],
    ]).replace(/,"buildingId":undefined,"role":undefined/, ''));
    const sent = calls[2][2];
    assert.equal('buildingId' in sent, false);
    assert.equal('role' in sent, false);
});

test('refreshes the persisted list after creation', async () => {
    const calls = [];
    const api = { list: async () => { calls.push('list'); return [{ id: 'tenant-1' }]; }, create: async () => calls.push('create') };
    const store = loadFactories().createTenantsStore(api);
    await store.create({});
    assert.deepEqual(store.getAll(), [{ id: 'tenant-1' }]);
    assert.deepEqual(calls, ['create', 'list']);
});

test('rejects a malformed list response', async () => {
    const api = loadFactories({ get: async () => ({ data: {} }) }).createTenantsApi({ get: async () => ({ data: {} }) });
    await assert.rejects(api.list(), { code: 'INVALID_TENANTS_RESPONSE' });
});
