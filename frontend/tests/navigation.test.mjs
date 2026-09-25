import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/shared/navigation.js', import.meta.url), 'utf8');

function element() {
    return {
        listeners: {},
        addEventListener(name, callback) { this.listeners[name] = callback; },
        classList: { add() {}, remove() {}, contains() { return false; } },
        click() {},
        getAttribute() { return 'dashboard'; },
        parentElement: { classList: { add() {}, remove() {} } },
        querySelector() { return { textContent: 'Dashboard' }; },
        style: {},
        textContent: ''
    };
}

test('navigation setup tolerates an optional contracts shortcut being absent', () => {
    const quickContract = element();
    const context = {
        document: {
            addEventListener() {},
            getElementById(id) {
                if (id === 'btn-quick-contract') return quickContract;
                if (id === 'link-go-to-contracts') return null;
                return element();
            },
            querySelector() { return element(); },
            querySelectorAll() { return []; }
        }
    };
    vm.createContext(context);
    vm.runInContext(source, context);

    assert.doesNotThrow(() => vm.runInContext('setupNavigation()', context));
    assert.equal(typeof quickContract.listeners.click, 'function');
});
