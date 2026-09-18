import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/auth/index.js', import.meta.url), 'utf8');

function harness({ context = { userId: 'internal-id', role: 'gestor', buildingId: 'building-id' }, session = null, invite = false } = {}) {
    const elements = new Map();
    function element(id) {
        if (!elements.has(id)) {
            const classes = new Set(id === 'login-container' ? ['active'] : []);
            elements.set(id, {
                id, value: '', textContent: '', style: {}, disabled: false,
                classList: {
                    add: (...names) => names.forEach(name => classes.add(name)),
                    remove: (...names) => names.forEach(name => classes.delete(name)),
                    contains: name => classes.has(name)
                },
                listeners: {},
                addEventListener(name, callback) { this.listeners[name] = callback; },
                querySelector: () => element('submit-button'),
                reset() { this.value = ''; }
            });
        }
        return elements.get(id);
    }
    const events = {};
    const calls = [];
    const auth = {
        getSession: async () => ({ data: { session }, error: null }),
        signInWithPassword: async () => ({ data: { user: { email: 'teste@example.invalid', user_metadata: { role: 'admin', buildingId: 'forged' } } }, error: null }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: { email: 'teste@example.invalid' } } }),
        updateUser: async () => ({ error: null })
    };
    const environment = {
        currentUser: { role: null }, supabaseClient: { auth }, isInviteFlow: invite,
        window: { apiClient: { get: async path => { calls.push(path); if (context instanceof Error) throw context; return context; } }, history: { replaceState() {} }, location: { pathname: '/' } },
        document: {
            body: element('body'), getElementById: element,
            querySelector: () => element('password-toggle'),
            addEventListener: (name, callback) => { events[name] = callback; }
        },
        applyUserRoleSettings() { calls.push('apply-role'); },
        loadDashboardData() { calls.push('dashboard'); },
        Set
    };
    vm.createContext(environment);
    vm.runInContext(source, environment);
    vm.runInContext('setupForms()', environment);
    async function submitLogin() {
        element('username').value = 'teste@example.invalid';
        element('password').value = 'senha-ficticia';
        await element('login-form').listeners.submit({ preventDefault() {} });
    }
    return { environment, element, events, calls, auth, submitLogin };
}

test('login uses the API role and scope, ignoring forged Supabase metadata', async () => {
    const h = harness();
    await h.submitLogin();
    assert.equal(h.environment.currentUser.role, 'gestor');
    assert.equal(h.environment.currentUser.buildingId, 'building-id');
    assert.equal(h.environment.currentUser.id, 'internal-id');
    assert.equal(h.element('app-container').classList.contains('active'), true);
    assert.deepEqual(h.calls, ['/auth/context', 'apply-role', 'dashboard']);
});

test('restored session waits for the API context', async () => {
    const h = harness({ session: { user: { email: 'restored@example.invalid' } } });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.environment.currentUser.role, 'gestor');
    assert.equal(h.element('app-container').classList.contains('active'), true);
});

test('invitation does not open a restored session before password setup', async () => {
    const h = harness({ session: { user: { email: 'invite@example.invalid' } }, invite: true });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.element('app-container').classList.contains('active'), false);
    assert.deepEqual(h.calls, []);
});

test('logout invalidates an in-flight context response', async () => {
    let finish;
    const h = harness();
    h.environment.window.apiClient.get = () => new Promise(resolve => { finish = resolve; });
    const login = h.submitLogin();
    await new Promise(resolve => setImmediate(resolve));
    await h.element('btn-logout').listeners.click();
    finish({ userId: 'internal-id', role: 'admin', buildingId: null });
    await login;
    assert.equal(h.environment.currentUser.role, null);
    assert.equal(h.element('app-container').classList.contains('active'), false);
});

for (const context of [new Error('403'), new Error('network'), { userId: 'id', role: 'developer', buildingId: null }, { userId: 'id', role: 'gestor', buildingId: null }]) {
    test('context failure remains closed: ' + (context.message || context.role), async () => {
        const h = harness({ context });
        await h.submitLogin();
        assert.equal(h.environment.currentUser.role, null);
        assert.equal(h.element('app-container').classList.contains('active'), false);
        assert.equal(h.element('login-container').classList.contains('active'), true);
    });
}

test('logout clears the UI identity and a later unauthorized event closes it', async () => {
    const h = harness();
    await h.submitLogin();
    await h.element('btn-logout').listeners.click();
    assert.equal(h.environment.currentUser.role, null);
    assert.equal(h.element('app-container').classList.contains('active'), false);
    await h.submitLogin();
    h.events['bueno:api-unauthorized']();
    assert.equal(h.element('app-container').classList.contains('active'), false);
});
