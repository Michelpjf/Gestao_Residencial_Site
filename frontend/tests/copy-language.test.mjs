import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const files = [
    '../index.html',
    '../src/auth/index.js',
    '../src/dashboard/view.html',
    '../src/dashboard/index.js',
    '../src/buildings/view.html',
    '../src/buildings/index.js',
    '../src/units/index.js',
    '../src/tenants/view.html',
    '../src/tenants/index.js',
    '../src/contracts/view.html',
    '../src/contracts/index.js',
    '../src/settings/view.html',
    '../src/settings/index.js',
];

const interfaceSource = (await Promise.all(
    files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')),
)).join('\n');

test('interface copy does not expose implementation language', () => {
    const outdatedPhrases = [
        'Restaurando acesso seguro',
        'Acesso seguro e protegido',
        'Indicadores essenciais calculados a partir dos registros persistidos',
        'Carregando dados persistidos',
        'Não foi possível carregar os dados persistidos',
        'Residenciais ativos no escopo autorizado',
        'Relação persistida por Residencial',
        'disponível no seu escopo',
        'consulte suas unidades persistidas',
        'Cadastro persistido no sistema',
        'Cadastro mínimo persistido',
        'Contratos persistidos com documento DOCX',
        'Persistir e preparar DOCX',
        'Baixar DOCX',
        'Gerando DOCX',
        'DOCX gerado com sucesso',
        'Persistindo Contrato',
        'Contrato persistido e pronto para DOCX',
        'Modelo: ${contract.templateVersion}',
        'Fonte de verdade da aplicação',
        'banco da Bueno Residence',
        'Carregando vínculos persistidos',
        'Salvando vínculo no banco da aplicação',
        'registrado na auditoria',
        'Seu perfil não',
        'fora do seu escopo',
        'para o seu perfil',
    ];

    for (const phrase of outdatedPhrases) {
        assert.doesNotMatch(interfaceSource, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    }
});

test('interface copy uses the approved operational language', () => {
    for (const phrase of [
        'Veja um resumo dos residenciais que você pode acessar.',
        'Resumo por residencial',
        'Cadastre moradores e associe cada um a uma Unidade.',
        'Cadastre contratos e gere o documento para download.',
        'Contrato salvo. O documento está pronto para download.',
        'Como funciona o acesso',
    ]) {
        assert.match(interfaceSource, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
});
