# Frontend do Bueno Residence

Frontend estático em HTML, CSS e JavaScript, sem etapa de build. Ele consome a API pela mesma origem em `/api` e usa o Supabase apenas para identidade e sessão.

## Configuração local

Copie `config.example.js` para `config.js` e informe somente a URL e a chave publicável do Supabase. `config.js` é ignorado pelo Git. Na imagem integrada, o backend gera `/config.js` em runtime.

## Telas

- `src/dashboard/`: quatro indicadores persistidos e relatório essencial.
- `src/buildings/` e `src/units/`: Residenciais e Unidades.
- `src/tenants/`: Moradores.
- `src/contracts/`: Contratos e download do DOCX gerado no backend.
- `src/settings/`: administração persistida do vínculo de Gestores.
- `src/auth/` e `src/shared/`: autenticação, cliente HTTP, sessão, navegação e ciclo de vida.

Não existem telas locais de Financeiro ou Desenvolvedor. O perfil de negócio `financeiro` permanece válido para os recursos autorizados pelo backend.

## Segurança e dados

- `GET /api/auth/context` é a fonte de `userId`, `role` e `buildingId`.
- Metadados do Supabase não concedem autorização.
- Dados de domínio não são persistidos em `localStorage`.
- O cliente HTTP aceita somente caminhos relativos, adiciona o token da sessão e normaliza erros.
- O DOCX é produzido exclusivamente pelo endpoint protegido do backend.

## Inicialização

1. `index.html` renderiza o shell e os slots das telas.
2. `app.js` carrega as views em paralelo.
3. Os scripts são carregados sequencialmente.
4. `bueno:ready` configura autenticação e navegação.

## Qualidade

```sh
npm ci
npm run check
```
