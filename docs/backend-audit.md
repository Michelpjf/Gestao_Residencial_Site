# Backend Mission 00 — Auditoria de autenticação, persistência e integrações

Data: 2026-09-09
Issue: #1

## 1. Estado atual

### Fatos observados
- O repositório não contém uma pasta `backend/` nem implementação de servidor na raiz.
- O frontend está em `frontend/` e carrega módulos JavaScript diretamente no navegador, sem etapa de build.
- O frontend possui código que chama rotas relativas `/api/...`, mas a implementação dessas rotas não está presente neste repositório.
- Há um cliente Supabase carregado no navegador e usado para autenticação.
- Persistência de domínio é híbrida: dados mockados + `localStorage` + tentativa de sincronização com `/api/...`.

### Consequência prática
O sistema atual não pode ser tratado como uma aplicação com backend funcional completo. Há autenticação cliente real via Supabase, mas a maior parte da lógica e persistência de negócio ainda depende de estado no navegador ou de endpoints não implementados neste repositório.

## 2. Autenticação

### Fatos observados
- `frontend/index.html` carrega `@supabase/supabase-js@2` por CDN.
- `frontend/src/shared/state.js` instancia um cliente Supabase no navegador.
- `frontend/src/auth/index.js` usa:
  - `signInWithPassword`;
  - `updateUser` para definição de senha;
  - `getUser`;
  - `getSession`;
  - `signOut`.
- Convite/recuperação de senha depende do fluxo de autenticação do Supabase.
- Após login, `currentUser.role`, `building` e `buildingId` são derivados de `user_metadata`.

### Avaliação
A autenticação existe de fato no cliente, porém autorização de negócio não está comprovada no servidor. Metadados de usuário e filtros visuais não devem ser tratados como barreira suficiente de segurança.

## 3. Persistência

### Fatos observados
`frontend/src/shared/state.js` mantém em memória e/ou `localStorage` estruturas como:
- residenciais/prédios;
- usuários;
- unidades;
- contratos;
- moradores;
- pagamentos;
- manutenção;
- despesas;
- depósitos PIX;
- caixa;
- logs de auditoria;
- arquivos/configurações relacionadas a integrações.

A função `saveState()` grava esses dados no navegador e em seguida chama `syncToBackend()`.

`syncToBackend()` tenta enviar coleções completas para endpoints como:
- `POST /api/buildings`;
- `POST /api/contracts`;
- `POST /api/cashbox`;
- `POST /api/units`;
- `POST /api/tenants`;
- `POST /api/pix_deposits`;
- `POST /api/maintenance`;
- `POST /api/expenses`;
- `POST /api/audit_logs`.

`loadFromBackend()` tenta ler os mesmos recursos por `GET`.

### Avaliação
A semântica atual parece ser de sincronização de snapshots inteiros, não CRUD transacional por entidade. Isso cria risco de sobrescrita, conflito entre usuários, perda de atualização concorrente e dificuldade de auditoria.

## 4. Integrações externas

### Confirmadas no código
- Supabase Auth no frontend.
- Supabase SDK por CDN.

### Referenciadas/simuladas
- Google Drive.
- Click/ClickUp API.
- Efí/Gerencianet.
- Bradesco.
- C6 Bank.

No módulo `developer`, os testes dessas integrações são majoritariamente simulados por `setTimeout` e mensagens de sucesso; não provam conectividade real.

### Endpoints locais esperados
O frontend espera um backend HTTP em `/api`, incluindo rotas de dados e administração de usuários.

## 5. Dependências do frontend em relação ao backend futuro

O backend precisará atender pelo menos às seguintes capacidades já esperadas pela interface:
- sessão autenticada e validação de token;
- usuários e perfis;
- convite de usuários;
- ativação/inativação;
- exclusão condicionada a regras de histórico;
- residenciais e unidades;
- moradores;
- contratos;
- caixa e depósitos PIX;
- manutenção e despesas;
- auditoria;
- autorização por perfil e, para Gestor, por residencial.

Rotas atualmente referenciadas no frontend incluem:
- `GET /api/users`;
- `POST /api/users/invite`;
- `PUT /api/users/:id/status`;
- `DELETE /api/users/:id`;
- endpoints de leitura/escrita para `buildings`, `contracts`, `cashbox`, `units`, `tenants`, `pix_deposits`, `maintenance`, `expenses` e `audit_logs`.

## 6. Dados mockados e hardcoded

### Mockados
`frontend/src/shared/state.js` contém dados simulados de:
- prédios;
- usuários;
- auditoria;
- relatórios semanais;
- caixa;
- depósitos PIX;
- erros de integrações.

`frontend/src/shared/lifecycle.js` chama funções de geração/sincronização de dados mockados durante a inicialização.

### Hardcoded
Há valores e regras temporárias diretamente no cliente, incluindo:
- datas e registros de exemplo;
- aluguéis de templates;
- usuário inicial e perfis de exemplo;
- nomes de residenciais;
- estados de demonstração.

Também existe ainda o perfil `developer` no frontend legado, embora a regra atual do projeto determine que ele não é perfil de negócio.

## 7. Débitos técnicos

1. Backend ausente apesar de o frontend já depender de `/api`.
2. Estado global mutável concentrado no navegador.
3. Persistência duplicada entre memória, `localStorage` e API esperada.
4. Sincronização por snapshot completo, inadequada para concorrência multiusuário.
5. Regras de autorização implementadas principalmente como filtros de interface.
6. Perfil legado `developer` ainda presente.
7. Dados de domínio e exemplos misturados no mesmo arquivo de estado.
8. Integrações externas simuladas junto da interface de produção.
9. Datas e valores de exemplo fixos em componentes de negócio.
10. A função de exclusão definitiva de usuário no frontend não expressa as restrições atuais de histórico/auditoria.

## 8. Riscos de segurança comprovados pelo código

### 8.1 Autorização cliente não é suficiente
O frontend filtra conteúdo conforme `currentUser.role` e `buildingId`. Isso melhora a experiência, mas não protege dados nem operações se o servidor não repetir e validar essas regras.

**Requisito para o backend:** RBAC e escopo por residencial devem ser impostos em cada rota/consulta relevante.

### 8.2 Dados pessoais em `localStorage`
Moradores, usuários, contratos, dados financeiros e logs podem ser mantidos no navegador.

Riscos:
- exposição em caso de XSS;
- permanência em dispositivo compartilhado;
- dificuldade de revogação e retenção centralizada;
- inconsistência com políticas futuras de LGPD.

### 8.3 Credenciais de integrações no navegador
O módulo de desenvolvedor permite armazenar no estado do navegador campos como tokens, API keys, client secrets e secrets bancários, persistidos por `saveState()` em `localStorage`.

Isso é inadequado para uso real. Credenciais privadas devem permanecer exclusivamente no servidor/secret store e nunca ser entregues ao cliente.

### 8.4 Exclusão definitiva de usuário
A interface oferece `DELETE /api/users/:id` como exclusão permanente. A regra atual do projeto determina que inativação/exclusão não pode romper contratos nem histórico auditável.

O backend futuro deve bloquear exclusão quando houver vínculos auditáveis e preferir inativação.

### 8.5 Chave pública do Supabase no frontend
Existe configuração pública do projeto Supabase no cliente. Isso, isoladamente, não prova vulnerabilidade: chaves públicas/publishable são próprias para uso cliente. A segurança depende de políticas do Supabase e/ou da API impedirem acesso indevido.

Não foi possível validar RLS/policies apenas pelo conteúdo deste repositório.

## 9. Necessidades do backend futuro

A fundação deverá oferecer, no mínimo:
- autenticação integrada à estratégia escolhida;
- autorização server-side por perfil;
- escopo de Gestor por residencial;
- modelo de dados relacional/coerente para usuários, residenciais, unidades, moradores e contratos;
- CRUD transacional;
- validação de entrada;
- trilha de auditoria server-side;
- regras de inativação/exclusão seguras;
- tratamento de concorrência;
- armazenamento seguro de secrets;
- estratégia para anexos/documentos sem guardar dados sensíveis desnecessariamente no navegador;
- logs sem exposição de dados pessoais ou credenciais;
- migração controlada dos mocks atuais.

## 10. Decisões pendentes

Antes de implementar a fundação, decidir explicitamente:
1. qual componente será a fonte de verdade da autenticação;
2. qual banco e camada de backend serão usados;
3. se Supabase permanecerá apenas para Auth, para Auth + banco, ou será removido;
4. como usuários e perfis serão modelados;
5. como RBAC e escopo por residencial serão aplicados;
6. como será a trilha de auditoria;
7. como anexos e documentos serão armazenados;
8. qual política de migração dos dados mock/localStorage será adotada;
9. como tratar exclusão versus inativação de usuários;
10. como separar integrações simuladas de integrações reais.

## 11. Alternativas arquiteturais compatíveis

Nenhuma alternativa é escolhida nesta auditoria.

### Alternativa A — Supabase como plataforma principal
- Supabase Auth.
- PostgreSQL/Supabase Database.
- RLS para autorização de dados, complementada por funções/backend onde necessário.
- Storage para anexos quando adequado.

**Vantagens:** menor mudança na autenticação atual; PostgreSQL relacional; recursos prontos.

**Pontos a validar:** RLS, custo/limites, estratégia de deploy e integração com a VPS/Coolify.

### Alternativa B — API própria + PostgreSQL
- Backend próprio em tecnologia a decidir.
- PostgreSQL como banco.
- Supabase Auth pode ser mantido inicialmente ou substituído depois.
- API REST com autorização server-side.

**Vantagens:** controle maior sobre regras de negócio, auditoria e deploy no Coolify.

**Pontos a validar:** maior responsabilidade operacional, migrations, backups, autenticação e manutenção.

### Alternativa C — PocketBase como backend inicial
- PocketBase para autenticação, coleções e API.
- SQLite como armazenamento inicial.
- Deploy autocontido em VPS/Coolify.

**Vantagens:** simplicidade operacional e velocidade de implantação acadêmica/MVP.

**Pontos a validar:** concorrência, evolução do modelo, auditoria, requisitos futuros, migração posterior e adequação ao uso real com dados sensíveis.

## 12. O que foi validado

Foram inspecionados:
- `AGENTS.md`;
- `frontend/index.html`;
- `frontend/app.js`;
- árvore completa de `frontend/src`;
- `src/shared/state.js`;
- `src/shared/lifecycle.js`;
- `src/shared/navigation.js`;
- `src/auth/index.js`;
- `src/dashboard/index.js`;
- `src/buildings/index.js`;
- `src/tenants/index.js`;
- `src/contracts/index.js`;
- `src/finance/index.js`;
- `src/settings/index.js`;
- `src/developer/index.js`.

Não foi feita mudança funcional na aplicação.

## 13. Incertezas restantes

Não foi possível validar apenas por este repositório:
- existência de um backend externo/deploy separado que implemente `/api`;
- políticas RLS atuais do projeto Supabase;
- configuração real do Supabase Auth;
- dados existentes em banco remoto;
- infraestrutura atualmente implantada fora do repositório;
- uso real de Google Drive/Click/Efí/Bradesco/C6.

## Conclusão

O estado real é um frontend modularizado com autenticação Supabase no cliente, ampla base de dados simulados/localStorage e contratos implícitos de API ainda sem implementação no repositório. A próxima missão não deve começar codando rotas aleatoriamente: primeiro deve fechar a decisão arquitetural e o modelo mínimo de autenticação/RBAC/persistência que substituirá esse estado híbrido.
