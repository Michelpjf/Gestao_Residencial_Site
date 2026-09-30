import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const view = await readFile(new URL('../src/settings/view.html', import.meta.url), 'utf8');
const controller = await readFile(new URL('../src/settings/index.js', import.meta.url), 'utf8');

test('settings exposes only persisted manager-to-residential administration', () => {
    assert.match(view, /id="manager-assignments-body"/);
    assert.match(view, /Gestores e residenciais/);
    assert.match(view, /Como funciona o acesso/);
    assert.doesNotMatch(view, /Fonte de verdade|banco da Bueno Residence|perfil ativo/);
    assert.doesNotMatch(view, /Google Drive|Logs de atividade|Enviar convite|Matriz de permissões/);
});

test('settings does not use fake records or browser persistence', () => {
    assert.match(controller, /settingsAssignmentsApi\.list\(\)/);
    assert.match(controller, /settingsAssignmentsApi\.update/);
    assert.doesNotMatch(controller, /localStorage|mock|fakeUsers|invite/);
});
