# Plano de modernização UX/UI

## Objetivo

Modernizar a interface sem interromper o MVP homologado, eliminando a aparência genérica de interface produzida por IA e estabelecendo uma identidade profissional coerente com a Bueno Residence. A API, o RBAC do servidor e os dados persistidos permanecem como fonte de verdade. A execução deve ocorrer por Issues pequenas e sequenciais, com homologação antes da remoção de cada tela legada.

## Diagnóstico atual

- O frontend usa HTML, CSS e JavaScript sem etapa de build.
- Há telas atuais integradas à API e telas legadas baseadas em estado local e simulações.
- A composição visual atual usa muitos efeitos decorativos, animações, gradientes, cartões e estilos concorrentes. O resultado não comunica com clareza uma plataforma imobiliária profissional.
- “Remover a aparência de IA” significa substituir esse visual genérico por hierarquia, tipografia, espaçamento, linguagem e componentes consistentes com a marca; não significa remover um perfil de usuário chamado IA.
- O perfil técnico `developer` e o usuário fictício `Dev Antigravity` continuam no frontend, embora não sejam perfis de negócio.
- A área Desenvolvedor mantém configurações e campos técnicos em `localStorage`; ela deve ser removida, não migrada.
- Uma adoção direta de componentes React no código atual criaria duas arquiteturas difíceis de manter. A fundação precisa vir antes do redesign das telas.

## Stack recomendada

- **Vite + React + TypeScript:** fundação do frontend componentizado e com build reproduzível.
- **Tailwind CSS + shadcn/ui:** tokens visuais e componentes acessíveis sob controle do projeto.
- **Lucide React:** conjunto único de ícones, sem SVGs duplicados manualmente.
- **TanStack Query:** sessão de dados, cache, carregamento, erro, invalidação e nova consulta após mutações.
- **React Hook Form + Zod:** formulários tipados e validação consistente com os contratos da API.
- **TanStack Table:** listagens com ordenação, filtros, paginação e responsividade quando a quantidade de dados justificar.
- **Recharts:** somente para indicadores que realmente precisem de gráficos.
- **Vitest + Testing Library + Playwright + axe-core:** testes de unidade, integração, fluxo real e acessibilidade.

Referências oficiais: [Vite](https://vite.dev/guide/), [React](https://react.dev/learn), [shadcn/ui](https://ui.shadcn.com/docs/official), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview), [TanStack Table](https://tanstack.com/table/latest/docs/overview), [Zod](https://zod.dev/) e [Lucide](https://lucide.dev/guide/react).

## Execução proposta

### Issue 1 — Direção visual profissional e protótipo aprovado

- Auditar as telas atuais e registrar inconsistências de hierarquia, densidade, tipografia, cores, ícones, textos, animações e responsividade.
- Definir princípios visuais: sóbrio, confiável, imobiliário, operacional, acessível e sem ornamentação gratuita.
- Criar tokens iniciais da marca para cores, tipografia, espaçamento, raios, sombras e movimento.
- Produzir protótipos do Login, Dashboard e uma tela operacional representativa.
- Comparar as propostas renderizadas e obter aprovação antes de alterar todas as telas.

Critério de aceite: direção visual aprovada em desktop e celular, com componentes e estados representativos suficientes para orientar a implementação.

### Issue 2 — Remover a área técnica legada

- Remover `developer` das classes, opções, dados fictícios e navegação.
- Remover `src/developer/` e o carregamento de seus scripts e views.
- Remover `Dev Antigravity` e a recriação automática desse usuário.
- Eliminar do `localStorage` configurações, tokens e segredos técnicos legados.
- Confirmar que somente perfis de negócio continuam aceitos.

Critério de aceite: nenhum elemento, dado, rota visual ou estado persistido relacionado a `developer` permanece no frontend; login com perfil não comercial continua fechado.

Essa limpeza é uma dívida técnica e de segurança independente do objetivo visual; `developer` não é o “perfil de IA” citado no pedido.

### Issue 3 — Criar a fundação moderna sem trocar telas

- Adicionar Vite, React e TypeScript ao pacote frontend.
- Preservar `/config.js`, Supabase Auth e `/api` na mesma origem.
- Criar shell, roteamento, tratamento de erro e restauração de sessão.
- Criar tokens da marca Bueno Residence e configuração inicial do shadcn/ui.
- Manter a aplicação legada disponível durante a migração controlada.

Critério de aceite: build reproduzível, mesma autenticação/RBAC e nenhum módulo funcional perdido.

### Issue 4 — Design system e padrões de UX

- Componentes de botão, campo, seleção, modal, drawer, toast, badge, skeleton, empty state e confirmação.
- Estados obrigatórios: inicial, carregando, vazio, sucesso, erro, sem permissão e sessão expirada.
- Layout responsivo para computador, tablet e celular.
- Navegação por teclado, foco visível, contraste e leitores de tela.

Critério de aceite: catálogo de componentes testado e sem regras de permissão apenas visuais.

### Issues 5 a 9 — Migrar uma área por vez

Ordem sugerida:

1. Dashboard e relatório essencial.
2. Residenciais e Unidades.
3. Moradores.
4. Contratos e download DOCX.
5. Login, perfil e auditoria.

Cada área deve reutilizar a API atual, manter o RBAC no servidor, receber testes e ser homologada antes da próxima.

### Issue 10 — Remover o frontend legado

- Excluir HTML, CSS, JavaScript e estado local substituídos.
- Remover dependências e assets não utilizados.
- Conferir bundle, CSP, desempenho e cache.
- Executar E2E completo de Admin, Gerente e Gestor.

Critério de aceite: existe uma única implementação de cada tela, sem mocks ou fallbacks locais concorrendo com a API.

## Regras de execução

- Uma Issue por vez; não migrar todo o produto em um único PR.
- Não alterar backend e regras de negócio apenas para acomodar componentes visuais.
- Não armazenar tokens, senhas, chaves ou configurações privadas no navegador.
- Admin continua somente leitura e auditoria; controles ocultos no frontend não substituem `403` no servidor.
- Toda tela migrada precisa passar por teste responsivo, acessibilidade e homologação autenticada.
