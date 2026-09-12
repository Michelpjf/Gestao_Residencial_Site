# Frontend modular

O frontend continua sem etapa de build e pode ser publicado diretamente como site estático. O arquivo `app.js` é apenas o bootstrap: carrega as views e, depois, os módulos JavaScript na ordem necessária para manter compatibilidade com o estado global legado.

## Estrutura

- `src/auth/` — autenticação e definição de senha
- `src/dashboard/` — indicadores e regras de perfil
- `src/buildings/` — prédios, blocos e unidades
- `src/tenants/` — inquilinos e relatórios globais
- `src/contracts/` — contratos e assinaturas
- `src/finance/` — financeiro, PIX e caixa
- `src/settings/` — usuários, permissões, Drive e auditoria
- `src/developer/` — integrações e ferramentas técnicas
- `src/shared/` — estado, ciclo de vida e navegação

## Cliente HTTP

Os módulos que consomem o backend devem usar `window.apiClient`, configurado em `src/shared/api-session.js`. O cliente adiciona o token da sessão Supabase, aplica timeout de 10 segundos e converte falhas em `ApiError` com `code`, `status` e `details`.

```js
const buildings = await window.apiClient.get('/buildings');
const created = await window.apiClient.post('/buildings', { name: 'Bloco A' });
```

Os caminhos precisam começar com `/` e não podem ser URLs absolutas, evitando o envio acidental do token para outro destino. Respostas 401 e 403 disparam, respectivamente, os eventos `bueno:api-unauthorized` e `bueno:api-forbidden` no `document`.

Por padrão, a base é `/api`. Uma implantação com backend separado pode definir `window.BUENO_API_URL` antes de carregar `app.js`.

### Residenciais

A tela de Residenciais usa `window.buildingsStore` como estado em memória e sempre o atualiza por `GET /api/buildings`. Criar, renomear e inativar chamam a API e recarregam a lista persistida; o snapshot legado do `localStorage` não alimenta essa tela. Nesta etapa, somente o nome do residencial é persistido. Unidades, gestores e ocupação permanecem para as próximas sprints.

Cada tela possui um `view.html` e um `index.js`. O login permanece no shell principal para aparecer imediatamente, mas toda a sua lógica está em `src/auth/index.js`.

## Inicialização

1. `index.html` renderiza o shell e os slots das telas.
2. `app.js` busca os arquivos `view.html` em paralelo.
3. Os scripts são carregados sequencialmente para preservar dependências existentes.
4. O evento `bueno:ready` inicializa a aplicação somente quando todas as telas estiverem disponíveis.

Ao adicionar uma tela, crie sua pasta, registre a view e o script nos manifestos do `app.js` e adicione o slot correspondente no `index.html`.
