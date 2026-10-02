# Bueno Residence Gestão

Sistema web para apoiar a gestão de residenciais, unidades, moradores e contratos do Bueno Residence. O projeto nasceu como entrega acadêmica para um cliente real e foi estruturado para continuar evoluindo depois do semestre.

> O repositório contém um MVP funcional em evolução. Testes automatizados e builds locais não substituem a homologação autenticada por perfil antes do uso operacional.

## Visão geral

O Bueno Residence Gestão substitui cadastros e rotinas manuais por fluxos persistidos e controlados por perfil. A aplicação combina um frontend estático, uma API própria e autenticação externa sem transferir as regras de autorização para o navegador.

Fluxo principal do MVP:

```text
Login → Residenciais → criação de Unidades em lote → mapa operacional → Moradores → Contratos/DOCX → Dashboard e relatório
```

## Funcionalidades disponíveis

| Área | Entrega atual |
| --- | --- |
| Autenticação | Login e sessão pelo Supabase Auth, com perfil e escopo resolvidos pela API |
| Residenciais | Listagem, cadastro e alteração conforme as permissões do perfil |
| Unidades | Cadastro individual ou em lote, mapa por subdivisão e situação calculada por Contratos |
| Moradores | Cadastro, busca, arquivamento e consulta histórica do titular vinculado à Unidade |
| Contratos | Cadastro, consulta e geração de documento DOCX pelo backend |
| Dashboard | Oito indicadores persistidos de Residenciais, Unidades, ocupação, Contratos e Moradores |
| Relatório essencial | Relação operacional sem exposição de documentos pessoais ou valores |
| Gestores | Administração do vínculo entre Gestores e Residenciais, com auditoria |

Dados mockados e `localStorage` não são fontes de verdade para o domínio. Os dados operacionais são persistidos no PostgreSQL e acessados pela API.

## Arquitetura

```text
Navegador
├── Supabase Auth ───────── identidade e sessão
└── Frontend estático
    └── API Node.js/Express ── autenticação, RBAC e regras de negócio
        ├── PostgreSQL ─────── perfis, escopo e dados do domínio
        └── Template DOCX ──── geração protegida de contratos
```

- O Supabase fornece identidade e sessão.
- A API resolve `userId`, `role` e `buildingId` a partir do perfil persistido.
- O backend aplica RBAC e escopo por Residencial.
- O frontend consome a API pela mesma origem em `/api` na imagem integrada.
- O documento de contrato é gerado exclusivamente pelo endpoint protegido do backend.

## Perfis reconhecidos

- **Admin:** consulta os módulos operacionais e administra vínculos de Gestores.
- **Gerente:** executa os cadastros operacionais permitidos globalmente.
- **Gestor:** atua somente no Residencial associado ao seu perfil.
- **Financeiro:** consulta os recursos operacionais autorizados, incluindo contratos e relatório essencial.
- **Manutenção:** possui acesso limitado aos recursos operacionais autorizados.

As permissões efetivas são verificadas no servidor. Valores enviados pelo cliente ou metadados do Supabase não concedem acesso.

## Tecnologias

- Node.js 24 e Express 5;
- PostgreSQL;
- Supabase Auth;
- HTML, CSS e JavaScript sem etapa de build no frontend;
- Vitest, Node Test Runner e ESLint;
- Docker e GitHub Actions.

## Estrutura do repositório

```text
.
├── .github/                 # integração contínua
├── backend/                 # API, migrations, domínio e testes
├── docs/                    # design e roteiro de homologação
├── frontend/                # interface estática e testes
├── Dockerfile               # imagem integrada de homologação
└── README.md                # visão geral do projeto
```

Documentação complementar:

- [Arquitetura do backend](backend/docs/architecture.md)
- [Referência do backend](backend/README.md)
- [Referência do frontend](frontend/README.md)
- [Direção visual](docs/DESIGN.md)
- [Homologação integrada](docs/homologation.md)

## Pré-requisitos

- Node.js 22 ou superior;
- npm;
- PostgreSQL;
- projeto Supabase com Auth configurado;
- Docker, opcional para a imagem integrada.

## Execução local

### Backend

Na pasta `backend/`:

```powershell
Copy-Item .env.example .env
npm ci
npm run migrate
npm run dev
```

O servidor inicia por padrão em `http://localhost:3000`. O endpoint `GET /health` verifica apenas o processo; ele não comprova conexão com banco, autenticação ou RBAC.

### Frontend isolado

Na pasta `frontend/`:

```powershell
Copy-Item config.example.js config.js
npm ci
```

Preencha `config.js` somente com a URL e a chave publicável do Supabase e sirva a pasta por HTTP. Esse arquivo é ignorado pelo Git.

Para validar o fluxo completo em mesma origem, prefira a imagem Docker integrada ou siga o [roteiro de homologação](docs/homologation.md).

## Variáveis de ambiente

Use `backend/.env.example` como referência. As principais variáveis são:

| Variável | Finalidade |
| --- | --- |
| `DATABASE_URL` | conexão privada com o PostgreSQL |
| `DATABASE_SSL` | ativa TLS na conexão com o banco |
| `SUPABASE_URL` | URL pública do projeto Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | chave publicável usada pelo cliente e na validação compatível de tokens |
| `SUPABASE_JWT_AUDIENCE` | audiência esperada dos tokens |
| `TRUST_PROXY` | quantidade de proxies confiáveis diante da aplicação |

Nunca registre `.env`, senhas, tokens, chaves privadas ou dados pessoais no Git, em Issues, PRs ou logs.

## Qualidade

Backend:

```powershell
Set-Location backend
npm run check
npm audit --omit=dev
```

Frontend:

```powershell
Set-Location frontend
npm run check
```

A integração contínua executa lint, testes e os builds Docker da API e da aplicação integrada em cada pull request.

## Docker

### Roteiro para avaliação do professor

Os comandos abaixo usam PowerShell e iniciam a imagem integrada de frontend e backend. É necessário ter Git e Docker Desktop instalados, com o Docker Desktop iniciado e configurado para containers Linux. Node.js e npm não precisam estar instalados no computador para esse roteiro.

O repositório usa `docker build` e `docker run`. Não há arquivo Docker Compose versionado; portanto, `docker compose up` não é um comando de inicialização disponível nesta entrega.

**1. Obter o projeto**

```powershell
git clone https://github.com/Michelpjf/Gestao_Residencial_Site.git
Set-Location Gestao_Residencial_Site
Copy-Item backend/.env.example backend/.env
```

**2. Configurar o ambiente de avaliação**

Antes de continuar, preencher `backend/.env` com a conexão de um PostgreSQL exclusivo de avaliação, a URL do projeto Supabase e sua chave publicável. Ajustar `DATABASE_SSL` conforme o banco utilizado; manter `PORT=3000` e `TRUST_PROXY=false` para acesso local direto.

O banco deve estar acessível a partir do container. No Docker Desktop, se o PostgreSQL estiver publicado no computador local, usar `host.docker.internal` como host em `DATABASE_URL`, em vez de `localhost`. Para preparar um PostgreSQL local com volume persistente, seguir a [seção PostgreSQL local do backend](backend/README.md#postgresql-local).

Solicitar à equipe uma conta exclusiva de avaliação. A conta precisa existir no Supabase Auth e ter perfil ativo correspondente em `app_user_profiles`; o perfil Gestor também precisa estar vinculado a um Residencial ativo. As migrations criam a estrutura do banco, mas não criam contas, perfis nem dados de demonstração. Uma conta Gerente permite testar os cadastros operacionais; Admin consulta esses cadastros e administra vínculos de Gestores.

As configurações privadas e o acesso de avaliação devem ser fornecidos separadamente ao professor, sem publicação no repositório.

Contas destinadas à apresentação e à avaliação:

| Perfil | E-mail | Uso na avaliação |
| --- | --- | --- |
| Admin | `admin.apresentacao@bueno.com` | Consultar os módulos operacionais e administrar vínculos de Gestores |
| Gerente | `gerente.apresentacao@bueno.com` | Testar os cadastros de Residenciais, Unidades, Moradores e Contratos |
| Gestor | `gestor.apresentacao@bueno.com` | Testar os recursos permitidos dentro do Residencial associado |

Solicitar a senha à equipe por canal privado. Antes da avaliação, a equipe deve confirmar que essas contas estão ativas no Supabase Auth e vinculadas aos perfis e ao banco configurados para o teste. Após a avaliação, a equipe deve revogar o acesso temporário.

**3. Construir a imagem e aplicar as migrations**

```powershell
docker build --tag bueno-residence .
docker run --rm --env-file backend/.env bueno-residence node src/db/migrate.js
```

Continuar somente se as migrations terminarem com sucesso (`Migrations complete`).

**4. Iniciar e abrir a aplicação**

```powershell
docker run --detach --rm --name bueno-residence-avaliacao --publish 127.0.0.1:3000:3000 --env-file backend/.env bueno-residence
```

Abrir **http://localhost:3000** no navegador e entrar com a conta de avaliação. A imagem fornece automaticamente a configuração pública do Supabase ao frontend; não é necessário criar `frontend/config.js` nesse roteiro.

Em caso de falha ao iniciar, consultar:

```powershell
docker logs bueno-residence-avaliacao
```

**5. Conferir o funcionamento**

```powershell
Invoke-WebRequest http://localhost:3000/health
```

O resultado esperado é HTTP 200. Esse endpoint comprova apenas que o processo responde. Para avaliar o fluxo completo, conferir também:

- login e carregamento dos módulos permitidos ao perfil;
- consulta de Residenciais, Unidades, Moradores, Contratos e Dashboard;
- com Gerente, cadastro de Residencial e Unidades, seguido de Morador e Contrato;
- download e abertura do DOCX de um Contrato;
- recarga da página preservando os registros no PostgreSQL;
- com Gestor, acesso restrito ao Residencial associado.

Usar somente dados fictícios no banco de avaliação.

**6. Encerrar a aplicação**

```powershell
docker stop bueno-residence-avaliacao
```

Esse comando encerra e remove somente o container da aplicação. Os dados permanecem no PostgreSQL configurado em `DATABASE_URL`. Para iniciar novamente, repetir o comando do passo 4.

A imagem roda com usuário não privilegiado e possui healthcheck em `/health`. Para ambientes hospedados, seguir também o [roteiro de homologação](docs/homologation.md).

## Segurança e privacidade

- autorização e escopo são aplicados no backend;
- consultas SQL são parametrizadas;
- respostas operacionais evitam repetir documentos pessoais sem necessidade;
- o download de contrato utiliza endpoint protegido e `Cache-Control: no-store`;
- inativação e auditoria são preferidas à exclusão que rompa o histórico;
- dados reais não devem ser usados em desenvolvimento ou demonstrações.

Antes do uso real, o ambiente precisa passar pela validação autenticada descrita em `docs/homologation.md`, incluindo contas fictícias de Admin e Gestor, persistência após reinício, isolamento entre Residenciais e revisão de logs.

## Limites atuais

Não fazem parte do MVP atual:

- reservas independentes de Contratos, manutenção e bloqueios físicos das Unidades;
- assinatura eletrônica;
- upload e armazenamento de documentos pessoais;
- financeiro completo, manutenção e CRM de WhatsApp;
- exclusão de registros que comprometa histórico ou auditoria;
- declaração de prontidão para produção sem homologação completa.

## Fluxo de contribuição

Mudanças relevantes seguem o fluxo:

```text
Issue → branch → implementação → testes → pull request → revisão → merge
```

Migrations aplicadas não devem ser alteradas. Evoluções de banco devem ser adicionadas em novos arquivos numerados dentro de `backend/src/db/migrations/`.

## Estado do projeto

O MVP acadêmico possui as verticais principais implementadas e cobertas por testes automatizados. A evolução para uso operacional depende da homologação autenticada por perfil, validação dos dados fictícios no ambiente integrado e aprovação das próximas regras de negócio.
