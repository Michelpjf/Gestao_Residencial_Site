import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/dashboard/api.js', import.meta.url), 'utf8');

function loadApi(response) {
    const calls = [];
    class ApiError extends Error {
        constructor(message, options) { super(message); Object.assign(this, options); }
    }
    const window = {
        ApiError,
        apiClient: { async get(path) { calls.push(path); return response; } }
    };
    vm.runInNewContext(source, { window, Object });
    return { api: window.dashboardApi, calls };
}

test('loads the essential persisted report from the protected API', async () => {
    const data = { summary: { activeBuildings: 1, units: 2, tenants: 1, contracts: 1 }, rows: [] };
    const { api, calls } = loadApi({ data });
    assert.deepEqual(await api.getEssentialReport(), data);
    assert.deepEqual(calls, ['/reports/essential']);
});

test('rejects malformed report responses', async () => {
    const { api } = loadApi({ data: { summary: {}, rows: null } });
    await assert.rejects(api.getEssentialReport(), error => error.code === 'INVALID_REPORT_RESPONSE');
});
