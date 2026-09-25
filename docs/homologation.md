# Homologação integrada

Este procedimento prepara um ambiente demonstrável, não um deploy de produção. O `Dockerfile` da raiz serve o frontend e a API no mesmo container e na mesma origem HTTPS. Assim, o frontend usa `/api` sem CORS e frontend/backend correspondem ao mesmo SHA.

## Configuração no Coolify

- Fonte: este repositório e um SHA ou branch explicitamente registrados.
- Build pack: Dockerfile.
- Dockerfile: `/Dockerfile` (raiz do repositório).
- Porta interna: `3000`; não publicar PostgreSQL nem portas administrativas.
- Domínio: um hostname de homologação com HTTPS válido e redirecionamento HTTP para HTTPS.
- Healthcheck: `GET /health`, esperando HTTP 200.
- Proxy: encaminhar a origem inteira ao container; não separar `/api` em outro domínio.
- Rollback: manter a imagem/SHA anterior identificada antes de iniciar a mudança.

Defina exclusivamente no secret store do ambiente:

- `DATABASE_URL`
- `DATABASE_SSL`
- `DATABASE_SSL_REJECT_UNAUTHORIZED`
- `DATABASE_POOL_MAX`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_JWT_AUDIENCE`
- `TRUST_PROXY=1` quando houver exatamente um proxy confiável entre o cliente e o Node

`STATIC_DIR` já é definido pela imagem integrada. Não crie `.env` na raiz nem publique valores de configuração em Issue, PR, logs ou capturas.

O container publica `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` ao navegador em `/config.js`, com `Cache-Control: no-store`. Esses dois valores são configurações públicas do cliente, não credenciais administrativas. Nunca use nesse campo `service_role`, senha de banco ou outra chave privada.

## Banco e migrations

1. Confirmar que o PostgreSQL de homologação não está exposto publicamente.
2. Criar snapshot/backup e comprovar que existe procedimento de restauração.
3. Comparar `app_schema_migrations` com `backend/src/db/migrations`.
4. Executar `npm run migrate` no diretório `/app/backend` como etapa separada do startup.
5. Em falha, interromper o deploy e preservar banco e ledger. Não apagar registros nem reaplicar SQL manualmente.

O runner usa lock, checksums e uma transação por arquivo, mas não oferece rollback automático de schema. Se uma migration incompatível tiver sido aplicada, avaliar migration corretiva ou restauração controlada antes de voltar o container.

## Validação obrigatória

Registrar apenas resultados redigidos, sem tokens, senhas, documentos ou dados pessoais:

- URL HTTPS e certificado válido;
- SHA implantado e imagem correspondente;
- container saudável;
- `GET /health` retorna 200;
- `GET /api/auth/context` sem bearer retorna 401;
- login de contas fictícias Admin e Gestor resolve perfil e escopo no servidor;
- Gestor não acessa outro Residencial e rotas proibidas retornam 403;
- criação, recarga e reinício preservam os dados fictícios;
- logs não contêm token, credencial ou dado pessoal;
- frontend carrega sem bloqueios de CSP nem erros de rede/console.

Somente depois dessas evidências a Issue de homologação pode ser concluída. A validação integral do roteiro no navegador permanece uma etapa posterior.
