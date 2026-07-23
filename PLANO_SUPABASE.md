# Plano de Implementação: Migração para Supabase

Este plano detalha os passos para migrar nosso painel de gestão residencial, atualmente rodando via `localStorage`, para uma infraestrutura real e conectada à nuvem utilizando o **Supabase** (Banco de Dados, Autenticação e Storage).

## User Review Required

> [!IMPORTANT]
> **Aprovação da Arquitetura**
> Precisaremos criar um projeto no Supabase (gratuito) para obter a **URL** e a **Anon Key**. Como estamos usando Vanilla JS (sem backend em Node.js), as chamadas serão feitas direto do navegador.
> - **Autenticação:** O login atual de simulação será substituído por login real (E-mail/Senha). Você precisará cadastrar os usuários no painel do Supabase.
> - **Storage:** Ao invés do Google Drive, podemos usar o **Supabase Storage** (também gratuito até 1GB) para salvar os comprovantes de PIX em imagem/PDF, o que é mais rápido e integrado do que a API do Google Drive.

## Open Questions

> [!NOTE]
> **Respostas e Decisões (Para o Futuro):**
> 1. **Conta:** A conta do Supabase e o projeto ainda precisarão ser criados no momento da execução deste plano.
> 2. **Storage vs Drive:** 
>    - *Capacidade do Supabase Storage (Plano Gratuito):* 1 GB de armazenamento (o que é bastante para arquivos otimizados e comprovantes PIX, mas inferior aos 15GB do Google Drive).
>    - *Segurança do Supabase Storage:* É **altamente seguro**. Ele é totalmente integrado com as regras do banco de dados (RLS). Podemos criar regras estritas onde um arquivo de comprovante só pode ser aberto por quem fez o upload ou pelo Admin, impedindo acessos externos. Por essa facilidade de segurança nativa, o Supabase Storage continua sendo a recomendação para começar.
> 3. **Hospedagem:** Definido usar **Vercel** inicialmente.

---

## Proposed Changes

### 1. Configuração do Cliente Supabase

#### [MODIFY] [index.html](file:///C:/Users/mpaula/.gemini/antigravity-ide/scratch/gestao-residencial/index.html)
- Adicionar o script via CDN do Supabase JS no `<head>`.
- `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`

#### [MODIFY] [app.js](file:///C:/Users/mpaula/.gemini/antigravity-ide/scratch/gestao-residencial/app.js)
- Criar a inicialização do cliente Supabase:
  ```javascript
  const supabaseUrl = 'SUA_URL_AQUI';
  const supabaseKey = 'SUA_CHAVE_AQUI';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  ```

---

### 2. Banco de Dados e Esquema SQL

Será necessário rodar os seguintes scripts no SQL Editor do Supabase para criar a estrutura:

#### [NEW] [supabase/schema.sql](file:///C:/Users/mpaula/.gemini/antigravity-ide/scratch/gestao-residencial/supabase/schema.sql)
- Criação da tabela `buildings` (Prédios).
- Criação da tabela `units` (Unidades).
- Criação da tabela `tenants` (Inquilinos).
- Criação da tabela `contracts` (Contratos).
- Criação da tabela `pix_deposits` (Depósitos PIX).
- Configuração de políticas de segurança (RLS - Row Level Security) para garantir que usuários não logados não possam acessar os dados.

---

### 3. Refatoração da Camada de Dados (JS)

#### [MODIFY] [app.js](file:///C:/Users/mpaula/.gemini/antigravity-ide/scratch/gestao-residencial/app.js)
- **Autenticação:** Substituir a validação local por `await supabase.auth.signInWithPassword({ email, password })`.
- **Leitura (Load):** Substituir `localStorage.getItem` por consultas como `await supabase.from('pix_deposits').select('*')`.
- **Escrita (Save):** Substituir `localStorage.setItem` por `await supabase.from('pix_deposits').insert([dados])`.
- Como a API do Supabase é assíncrona (`async/await`), as funções atuais de renderização (ex: `loadPixTable`) precisarão exibir um *loading spinner* enquanto buscam os dados na nuvem.

---

### 4. Upload de Arquivos (Comprovantes PIX)

#### [MODIFY] [app.js](file:///C:/Users/mpaula/.gemini/antigravity-ide/scratch/gestao-residencial/app.js)
- Alterar a função que converte PDFs/Imagens para Base64.
- Implementar o upload direto para o bucket do Supabase: `await supabase.storage.from('comprovantes').upload(fileName, file)`.
- Salvar apenas a URL pública do arquivo na tabela `pix_deposits`.

---

## Verification Plan

### Automated/Manual Verification
- [ ] Conectar o projeto Supabase e testar se o objeto `supabase` é inicializado corretamente no console.
- [ ] Tentar realizar um login com usuário criado no Supabase Auth.
- [ ] Salvar um novo lançamento PIX no sistema e verificar no painel do Supabase se a linha foi adicionada na tabela de banco de dados.
- [ ] Fazer o upload de um comprovante no lançamento e checar se o arquivo apareceu na aba "Storage" do Supabase.
