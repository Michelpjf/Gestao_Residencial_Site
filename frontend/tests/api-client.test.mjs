import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/shared/api-client.js', import.meta.url), 'utf8');

function loadClient(fetchImpl) {
    const window = {
        AbortController,
        FormData,
        Headers,
        clearTimeout,
        fetch: fetchImpl,
        setTimeout,
    };
    vm.runInNewContext(source, { window });
    return window;
}

function jsonResponse(payload, init = {}) {
    return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'content-type': 'application/json' },
        ...init,
    });
}

test('adds the Supabase access token and serializes JSON bodies', async () => {
    let captured;
    const { createApiClient } = loadClient(async (url, options) => {
        captured = { url, options };
        return jsonResponse({ id: 'building-1' }, { status: 201 });
    });
    const client = createApiClient({
        baseUrl: 'https://api.example.test/api',
        getAccessToken: async () => 'session-token',
    });

    const result = await client.post('/buildings', { name: 'Bloco A' });

    assert.deepEqual(result, { id: 'building-1' });
    assert.equal(captured.url, 'https://api.example.test/api/buildings');
    assert.equal(captured.options.headers.get('authorization'), 'Bearer session-token');
    assert.equal(captured.options.headers.get('content-type'), 'application/json');
    assert.equal(captured.options.body, '{"name":"Bloco A"}');
});

test('does not allow callers to bypass centralized authorization', async () => {
    const capturedHeaders = [];
    const { createApiClient } = loadClient(async (_url, options) => {
        capturedHeaders.push(options.headers);
        return jsonResponse({});
    });
    const client = createApiClient({ getAccessToken: async () => 'trusted-token' });

    await client.get('/context', { headers: { Authorization: 'Bearer forged-token' } });
    await client.get('/health', { auth: false, headers: { Authorization: 'Bearer forged-token' } });

    assert.equal(capturedHeaders[0].get('authorization'), 'Bearer trusted-token');
    assert.equal(capturedHeaders[1].has('authorization'), false);
});

test('rejects absolute and protocol-relative paths before sending the token', async () => {
    let calls = 0;
    const { createApiClient } = loadClient(async () => {
        calls += 1;
        return jsonResponse({});
    });
    const client = createApiClient({ getAccessToken: async () => 'secret' });

    await assert.rejects(client.get('https://attacker.test/data'), { code: 'INVALID_API_PATH' });
    await assert.rejects(client.get('//attacker.test/data'), { code: 'INVALID_API_PATH' });
    assert.equal(calls, 0);
});

test('normalizes 401 and 403 responses and invokes their handlers', async () => {
    const statuses = [401, 403];
    const handled = [];
    const { createApiClient } = loadClient(async () => {
        const status = statuses.shift();
        return jsonResponse(
            { error: { code: status === 401 ? 'AUTH_REQUIRED' : 'FORBIDDEN', message: 'Denied' } },
            { status },
        );
    });
    const client = createApiClient({
        onUnauthorized: (error) => handled.push(['unauthorized', error.code]),
        onForbidden: (error) => handled.push(['forbidden', error.code]),
    });

    await assert.rejects(client.get('/context'), { code: 'AUTH_REQUIRED', status: 401 });
    await assert.rejects(client.get('/buildings'), { code: 'FORBIDDEN', status: 403 });
    assert.deepEqual(handled, [
        ['unauthorized', 'AUTH_REQUIRED'],
        ['forbidden', 'FORBIDDEN'],
    ]);
});

test('still handles unauthorized responses when their JSON is malformed', async () => {
    let handled;
    const { createApiClient } = loadClient(async () => new Response('{', {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'content-type': 'application/json' },
    }));
    const client = createApiClient({ onUnauthorized: (error) => { handled = error; } });

    await assert.rejects(client.get('/context'), { code: 'HTTP_401', status: 401 });
    assert.equal(handled.status, 401);
});

test('returns null for 204 and text for non-JSON responses', async () => {
    const responses = [new Response(null, { status: 204 }), new Response('ok', { status: 200 })];
    const { createApiClient } = loadClient(async () => responses.shift());
    const client = createApiClient();

    assert.equal(await client.delete('/buildings/building-1'), null);
    assert.equal(await client.get('/health'), 'ok');
});

test('distinguishes timeouts from network failures', async () => {
    const timeoutWindow = loadClient((_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    const timeoutClient = timeoutWindow.createApiClient({ timeoutMs: 5 });
    await assert.rejects(timeoutClient.get('/slow'), { code: 'API_TIMEOUT' });

    const networkWindow = loadClient(async () => {
        throw new TypeError('offline');
    });
    const networkClient = networkWindow.createApiClient();
    await assert.rejects(networkClient.get('/health'), { code: 'API_NETWORK_ERROR' });
});

test('caller cancellation is not reported as a timeout', async () => {
    const { createApiClient } = loadClient((_url, { signal }) => new Promise((_resolve, reject) => {
        if (signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
        }
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }));
    const client = createApiClient({ timeoutMs: 1000 });
    const controller = new AbortController();
    const request = client.get('/buildings', { signal: controller.signal });

    controller.abort();

    await assert.rejects(request, { code: 'API_REQUEST_ABORTED' });
});
