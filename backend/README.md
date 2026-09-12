# Backend do Bueno Residence Gestão

Fundação da API em Node.js + Express, preparada para PostgreSQL e integrada ao Supabase Auth. Esta missão não contém CRUDs de negócio.

O Supabase é um provedor de identidade inicial, não uma dependência do domínio. A aplicação recebe um middleware de autenticação na composição do runtime, e os futuros módulos de negócio dependem apenas do contexto autenticado (`userId`, `role` e `buildingId`). A conexão PostgreSQL também usa uma `DATABASE_URL` padrão e pode apontar para Supabase ou outro PostgreSQL compatível.

## Estrutura modular

```text
src/
├── app.js                    # composição HTTP e middlewares globais
├── server.js                 # ciclo de vida do processo
├── composition/              # liga provedores e dependências
├── config/                   # configuração validada
├── db/                       # conexão e migrations
├── middleware/               # autenticação, RBAC, erros e escopo
├── modules/                  # rotas e casos de uso por funcionalidade
│   ├── auth/
│   └── health/
├── repositories/             # persistência compartilhada atual
└── security/                 # adaptadores de provedores de identidade
```

Cada nova capacidade deve entrar em `modules/<nome>`, agrupando suas rotas, validação, casos de uso e persistência quando forem exclusivos do módulo. Dependências externas são criadas em `composition/` e injetadas no módulo. Não importar o SDK do Supabase em módulos de residenciais, unidades, moradores, contratos ou financeiro.

A ordem sugerida das próximas etapas é:

1. residenciais;
2. unidades;
3. moradores;
4. contratos;
5. financeiro e relatórios;
6. auditoria transversal.

Os limites entre Supabase, API e domínio estão detalhados em [`docs/architecture.md`](docs/architecture.md).

## Requisitos

- Node.js 22 ou superior;
- PostgreSQL;
- projeto Supabase com Auth.

## Execução local

1. Copie `.env.example` para `.env` e preencha apenas no ambiente local.
2. Instale as dependências com `npm ci`.
3. Execute `npm run migrate` para aplicar as migrations pendentes.
4. Execute `npm run dev`.
5. Consulte `GET http://localhost:3000/health`.

O servidor valida a configuração ao iniciar. O endpoint `/health` é uma verificação de processo (liveness) e não consulta o banco nem serviços externos.

`GET /api/auth/context` é a única rota protegida desta fundação. Ela permite validar a integração e devolve apenas `userId`, `role` e `buildingId` do contexto resolvido no servidor.

## Autenticação e autorização

O middleware de autenticação:

1. exige `Authorization: Bearer <token>`;
2. valida JWTs `ES256`/`RS256` localmente contra o JWKS do Supabase;
3. para projetos legados `HS256`, valida o token no endpoint Auth oficial usando a chave publicável;
4. usa apenas o identificador validado para buscar o perfil ativo em `app_user_profiles`;
5. vincula o identificador externo validado a um usuário interno da aplicação;
6. cria `req.auth` com `userId` interno, `role` e `buildingId` vindos do servidor.

Os perfis aceitos são `admin`, `gerente`, `gestor`, `financeiro` e `manutencao`. Para `gestor`, `building_id` é obrigatório. O middleware de escopo compara o residencial solicitado com esse valor persistido; `role` e `buildingId` enviados pelo cliente não concedem acesso.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NODE_ENV` | não | `development`, `test` ou `production` |
| `PORT` | não | Porta HTTP; padrão `3000` |
| `TRUST_PROXY` | não | Número de proxies confiáveis ou `false`; configure conforme a rede do Coolify |
| `DATABASE_URL` | sim | URL privada do PostgreSQL |
| `DATABASE_SSL` | não | Ativa TLS na conexão; padrão `false` |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | não | Valida o certificado TLS; padrão `true` |
| `DATABASE_POOL_MAX` | não | Limite do pool; padrão `10` |
| `SUPABASE_URL` | sim | URL pública do projeto Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | sim | Chave publicável usada apenas na validação remota de tokens legados `HS256` |
| `SUPABASE_JWT_AUDIENCE` | não | Audiência esperada; padrão `authenticated` |

Nunca grave o `.env` real no repositório. No Coolify, configure os valores no secret store da aplicação.

## Comandos de qualidade

- `npm test`: testes automatizados;
- `npm run lint`: análise estática;
- `npm run check`: lint e testes.

## Migrations

`npm run migrate` usa apenas as variáveis `DATABASE_*`. O executor aplica os arquivos SQL em ordem numérica, mantém o histórico em `app_schema_migrations` e valida o checksum dos arquivos já aplicados. Cada migration nova é executada em sua própria transação e um advisory lock impede duas execuções simultâneas.

Migrations aplicadas não devem ser editadas ou removidas. Para evoluir o schema, adicione um novo arquivo seguindo o padrão `NNN_descricao.sql`.

## Docker

Na pasta `backend/`:

```sh
docker build -t bueno-residence-backend .
docker run --rm -p 3000:3000 --env-file .env bueno-residence-backend
```

O container roda com usuário não privilegiado e inclui healthcheck próprio.
