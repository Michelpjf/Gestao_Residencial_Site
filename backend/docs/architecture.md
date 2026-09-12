# Estratégia modular do backend

## Decisão atual

O backend é uma API própria em Node.js + Express. O armazenamento relacional usa PostgreSQL compatível e pode ser hospedado no Supabase ou em outro provedor. O Supabase Auth é o provedor de identidade inicial, mas não é a fonte de permissões da aplicação.

PocketBase não faz parte da direção atual.

## Limites de responsabilidade

### Supabase Auth

- cadastra a identidade e emite o token;
- confirma que o token pertence a um usuário;
- fornece apenas o identificador externo usado para localizar o usuário interno;
- fica encapsulado pelo verificador de token criado em `composition/`;
- não decide perfil, residencial ou permissão de negócio.

### API

- valida o token por meio do adaptador configurado;
- busca perfil ativo e escopo no PostgreSQL da aplicação;
- aplica RBAC e escopo por residencial no servidor;
- executa regras, validações, auditoria e operações transacionais;
- expõe contratos HTTP estáveis ao frontend.

### PostgreSQL

- é a fonte de verdade dos dados de negócio;
- mantém um `user_id` interno independente de `identity_provider` e `auth_subject`;
- é acessado pela API com SQL PostgreSQL padrão e `DATABASE_URL`;
- não exige o SDK do Supabase nos módulos de negócio;
- pode sair do Supabase sem mudar os contratos HTTP nem as regras do domínio.

### Frontend

- envia o token de sessão para a API;
- não concede permissão por `role`, `buildingId` ou metadados locais;
- deixará de sincronizar snapshots completos e passará a usar endpoints por recurso;
- não deve armazenar dados pessoais, financeiros ou secrets como fonte de verdade em `localStorage`.

## Regra de dependência

Os módulos de negócio conhecem apenas dependências injetadas e o contexto autenticado normalizado:

```js
{
  userId,
  role,
  buildingId
}
```

Somente a camada de composição conhece simultaneamente implementações concretas como PostgreSQL e Supabase Auth. Trocar o provedor de identidade deve exigir um novo verificador de token e alteração na composição, não nos módulos de residenciais, unidades ou contratos.

## Formato de cada módulo

Adicionar apenas as peças exigidas pela etapa atual:

```text
modules/<nome>/
├── <nome>.routes.js       # contrato HTTP
├── <nome>.controller.js   # tradução HTTP, quando necessária
├── <nome>.service.js      # regra/caso de uso, quando necessário
├── <nome>.repository.js   # persistência exclusiva, quando necessária
└── <nome>.schema.js       # validação de entrada, quando necessária
```

Não criar arquivos vazios, classes-base ou interfaces especulativas. A estrutura cresce junto com casos de uso reais.

## Evolução por etapas

1. **Fundação:** autenticação, perfis, RBAC, erros, configuração e saúde.
2. **Residenciais:** primeiro CRUD real e padrão de validação/auditoria.
3. **Unidades:** relação com residencial e escopo do Gestor.
4. **Moradores:** dados pessoais, retenção e controles de acesso.
5. **Contratos:** regras, templates e histórico.
6. **Financeiro e relatórios:** transações, aprovações e trilha auditável.

Cada etapa deve entregar migration, rotas, regras server-side, testes e migração controlada do trecho correspondente do frontend. Não migrar o `localStorage` inteiro de uma vez.

## Uso consciente do Supabase

Pode ser usado enquanto reduzir trabalho operacional:

- Auth para identidade e sessão;
- PostgreSQL gerenciado;
- Storage, se for escolhido depois para um tipo de arquivo específico;
- recursos adicionais apenas quando houver requisito concreto.

Evitar dependência desnecessária de:

- metadados de usuário como autorização;
- chamadas diretas do frontend às tabelas de negócio;
- regras existentes somente em RLS;
- SDK do Supabase dentro dos módulos;
- formatos exclusivos de um provedor nos contratos da API.
