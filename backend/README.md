# Backend do Bueno Residence Gestão

API em Node.js + Express, preparada para PostgreSQL e integrada ao Supabase Auth. Residenciais, Unidades, Moradores, Contratos e o relatório essencial possuem verticais persistidas e protegidas por RBAC.

Para homologação em mesma origem, o `Dockerfile` da raiz empacota este backend e o frontend estático no mesmo container. O `backend/Dockerfile` permanece como imagem isolada da API. Veja `docs/homologation.md` para o preflight, migrations e validações externas.

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

`GET /api/auth/context` permite validar a integração e devolve apenas `userId`, `role` e `buildingId` do contexto resolvido no servidor.

## API de Residenciais

Todas as rotas exigem bearer token e usam o perfil resolvido no PostgreSQL:

| Método | Rota | Perfis | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/api/buildings` | todos os perfis de negócio | Lista ativos; Gestor recebe somente seu residencial |
| `POST` | `/api/buildings` | Gerente | Cria com `{ "name": "..." }` |
| `PATCH` | `/api/buildings/:buildingId` | Gerente | Altera o nome de um residencial ativo |
| `DELETE` | `/api/buildings/:buildingId` | indisponível | A inativação permanece bloqueada até haver um perfil operacional aprovado |

As respostas de sucesso usam `{ "data": ... }`. Nomes duplicados retornam `409`; entrada ou UUID inválidos retornam `400`; um residencial ausente ou já inativo retorna `404`.

## API de Unidades

Unidades pertencem a um Residencial ativo. A situação operacional não é editável: ela é calculada pelas datas dos Contratos como `vago`, `ocupado` ou `agendado`:

| Método | Rota | Perfis | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/api/buildings/:buildingId/units` | todos os perfis de negócio | Lista as Unidades ativas no escopo permitido |
| `POST` | `/api/buildings/:buildingId/units` | Gerente | Cria com `identification`, `subdivision` opcional e `type` (`quarto` ou `loft`) |
| `POST` | `/api/buildings/:buildingId/units/batch` | Gerente | Cria de 1 a 200 Unidades em uma única transação |
| `GET` | `/api/units/:unitId` | todos os perfis de negócio | Retorna o detalhe; Gestor fica limitado ao próprio Residencial |

A combinação normalizada de Residencial, subdivisão e identificação é única. Qualquer item inválido ou duplicado cancela o lote inteiro. Residenciais inativos preservam seus registros, mas suas Unidades não aparecem na visão operacional e não recebem novos cadastros. O mapa prioriza Contrato vigente, depois o próximo Contrato agendado e, na ausência de ambos, Unidade vaga. Edição, inativação e reservas independentes de Contrato não fazem parte desta etapa.

## API de Moradores

Moradores são titulares vinculados obrigatoriamente a uma Unidade. O Residencial é sempre derivado desse vínculo no servidor:

| Método | Rota | Perfis | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/api/tenants?status=active\|archived\|all` | Admin, Gerente, Gestor | Lista resumos sem CPF; `active` é o padrão e Gestor recebe somente o próprio Residencial |
| `POST` | `/api/tenants` | Gerente, Gestor | Cria o cadastro mínimo com os campos aprovados para contrato |
| `GET` | `/api/tenants/:tenantId` | Admin, Gerente, Gestor | Retorna o detalhe dentro do escopo autorizado |
| `DELETE` | `/api/tenants/:tenantId` | Gerente, Gestor | Arquiva sem apagar cadastro ou histórico |

O CPF é validado, normalizado para 11 dígitos e único, mas não integra listagens nem buscas. Unidade ausente, Residencial inativo ou vínculo fora do escopo são rejeitados sem revelar dados de outro Residencial. Moradores arquivados continuam consultáveis, porém não podem ser usados em novos Contratos. Financeiro e Manutenção não têm acesso direto a esses endpoints. Edição, exclusão definitiva, upload e dados financeiros não fazem parte desta etapa.

## API de Contratos

Contratos usam um único Morador titular. Unidade e Residencial são derivados do cadastro do Morador no servidor:

| Método | Rota | Perfis | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/api/contracts` | Admin, Gerente, Gestor, Financeiro | Lista resumida; Gestor recebe somente o próprio Residencial |
| `POST` | `/api/contracts` | Gerente, Gestor | Persiste valor, prazo e datas usando o Morador autorizado |
| `GET` | `/api/contracts/:contractId` | Admin, Gerente, Gestor, Financeiro | Retorna o detalhe operacional sem documentos pessoais do titular |
| `GET` | `/api/contracts/:contractId/document` | Admin, Gerente, Gestor, Financeiro | Gera o DOCX com cabeçalhos de download e `Cache-Control: no-store` |

O modelo aprovado está versionado em `modules/contracts/templates/temporada-v1.docx`. A geração preenche os dados pessoais somente dentro do documento autorizado; a listagem e o detalhe JSON não os repetem. Manutenção não acessa o recurso. Assinatura eletrônica, upload, PDF, edição e exclusão não fazem parte desta etapa.

O perfil `admin` permanece exclusivamente de leitura nos módulos operacionais. A única mutação administrativa autorizada é a atualização explícita do vínculo de um Gestor com seu Residencial, registrada em auditoria.

## API de acesso dos Gestores

O Supabase confirma somente a identidade. Nome de exibição, perfil e escopo pertencem ao PostgreSQL da aplicação:

| Método | Rota | Perfis | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/api/admin/manager-assignments` | Admin | Lista Gestores ativos e seus Residenciais persistidos |
| `PATCH` | `/api/admin/manager-assignments/:userId` | Admin | Atualiza `displayName` e `buildingId` e grava a alteração em auditoria |

A atualização aceita somente um Gestor ativo e um Residencial ativo. Nenhum identificador do provedor de autenticação é devolvido por essas rotas.

## API de Dashboard e relatório essencial

| Método | Rota | Perfis | Comportamento |
| --- | --- | --- | --- |
| `GET` | `/api/reports/essential` | Admin, Gerente, Gestor, Financeiro | Retorna oito contagens e a relação por Residencial; Gestor recebe somente o próprio escopo |

`summary` contém Residenciais ativos, total de Unidades, vagas, ocupadas, Contratos agendados, Contratos vigentes, Moradores ativos e Moradores arquivados. Todos os cálculos usam PostgreSQL e a data corrente. `rows` contém somente Residencial, Unidade, nome do Morador e número do Contrato, com valores nulos quando o vínculo seguinte não existe. CPF, RG, endereços, telefones e valores não fazem parte da resposta. Manutenção recebe `403` e o escopo é derivado exclusivamente do perfil persistido.

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
