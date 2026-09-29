# Bueno Residence Gestão

Sistema web de gestão residencial com frontend estático, API Node.js/Express, autenticação pelo Supabase Auth e dados de negócio persistidos em PostgreSQL.

## Estado atual

O MVP possui fluxos persistidos para:

- autenticação e contexto de acesso;
- Residenciais e Unidades;
- Moradores;
- Contratos e geração de DOCX;
- Dashboard e relatório essencial;
- administração do vínculo entre Gestores e Residenciais.

Dados mockados e `localStorage` não são fontes de verdade. Perfil, permissões e escopo são resolvidos no backend.

## Estrutura

- `backend/`: API, migrations, regras de negócio e testes.
- `frontend/`: HTML, CSS e JavaScript servidos sem etapa de build.
- `docs/DESIGN.md`: direção visual vigente.
- `docs/homologation.md`: procedimento de homologação em mesma origem.
- `Dockerfile`: imagem integrada de frontend e backend.

## Execução local

Backend:

```sh
cd backend
cp .env.example .env
npm ci
npm run migrate
npm run dev
```

Frontend isolado:

1. Copie `frontend/config.example.js` para `frontend/config.js`.
2. Informe somente a URL e a chave publicável do Supabase.
3. Sirva a pasta `frontend/` por HTTP.

Consulte os READMEs de `backend/` e `frontend/` para os contratos e detalhes de cada camada.

## Qualidade

```sh
cd backend
npm run check

cd ../frontend
npm run check
```

A CI também constrói as imagens Docker isolada e integrada. Testes locais não substituem a homologação autenticada descrita em `docs/homologation.md`.
