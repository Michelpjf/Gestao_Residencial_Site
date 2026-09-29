import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../src/shared/api-session.js', import.meta.url), 'utf8');

function loadSession(apiUrl) {
    let options;
    const window = {
        BUENO_API_URL: apiUrl,
        createApiClient(receivedOptions) {
            options = receivedOptions;
            return Object.freeze({});
        },
    };

    vm.runInNewContext(source, {
        CustomEvent,
        document: { dispatchEvent() {} },
        window,
    });

    return options;
}

test('creates the session client with the same-origin API by default', () => {
    const options = loadSession(undefined);

    assert.equal(options.baseUrl, '/api');
});

test('keeps the approved explicit API override', () => {
    const options = loadSession('https://api.example.test/api');

    assert.equal(options.baseUrl, 'https://api.example.test/api');
});
