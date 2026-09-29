import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const frontendRoot = new URL('../', import.meta.url);
const stateSource = readFileSync(new URL('src/shared/state.js', frontendRoot), 'utf8');

test('bootstrap and shell do not load removed prototype modules or browser DOCX libraries', () => {
    const bootstrap = readFileSync(new URL('app.js', frontendRoot), 'utf8');
    const shell = readFileSync(new URL('index.html', frontendRoot), 'utf8');
    const dockerfile = readFileSync(new URL('../../Dockerfile', import.meta.url), 'utf8');

    for (const source of [bootstrap, shell, dockerfile]) {
        assert.doesNotMatch(source, /src\/developer|src\/finance|pizzip\.min\.js|docxtemplater\.js|data-view-module="(?:developer|finance)"/i);
    }
    assert.equal(existsSync(new URL('src/developer/index.js', frontendRoot)), false);
    assert.equal(existsSync(new URL('src/developer/view.html', frontendRoot)), false);
    assert.equal(existsSync(new URL('src/finance/index.js', frontendRoot)), false);
    assert.equal(existsSync(new URL('src/finance/view.html', frontendRoot)), false);
    assert.equal(existsSync(new URL('pizzip.min.js', frontendRoot)), false);
    assert.equal(existsSync(new URL('docxtemplater.js', frontendRoot)), false);
});

test('legacy cleanup removes only the explicit Bueno keys', () => {
    const removed = [];
    const storage = { removeItem(key) { removed.push(key); } };
    const context = {
        window: {
            BUENO_CONFIG: {},
            location: { hash: '' },
            localStorage: storage,
        },
        document: { getElementById() { return null; } },
        Boolean,
    };
    vm.createContext(context);
    vm.runInContext(stateSource, context);

    assert.ok(removed.length > 0);
    assert.ok(removed.every((key) => key.startsWith('bueno_')));
    assert.ok(removed.includes('bueno_weekly_draft'));
    assert.ok(!removed.some((key) => key.startsWith('sb-')));
});

test('shared state has no mock domain data or snapshot synchronization', () => {
    assert.doesNotMatch(stateSource, /BUILDINGS_DATA|UNITS_DATA|TENANTS_DATA|CONTRACTS_DATA|USERS_DATA/);
    assert.doesNotMatch(stateSource, /saveState|loadState|syncToBackend|loadFromBackend/);
});
