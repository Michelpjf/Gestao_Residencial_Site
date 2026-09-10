# Gestao_Residencial_Site — Instruções para agentes

## Escopo
Estas instruções complementam o `AGENTS.md` global do Codex. Em conflito, siga a instrução mais específica aplicável e a tarefa/Issue atual.

## Projeto
Sistema web de gestão do Bueno Residence, projeto acadêmico com possibilidade de uso real. Repositório definitivo: `Michelpjf/Gestao_Residencial_Site`.

## Contexto persistente
Antes de tarefas relevantes, consulte o Segundo Cérebro `Michelpjf/segundo-cerebro` se estiver acessível no ambiente. Leia primeiro `00 - Sistema/INDEX.md`, depois apenas notas ligadas ao Bueno Residence e à tarefa. Consulte `08 - Skills/INDEX.md` e aplique somente skills relevantes. Não leia o cofre inteiro. Se não houver acesso, informe; não invente contexto.

## Estado e decisões atuais
- Frontend em `frontend/`, já modularizado e sem etapa de build.
- Não assumir backend funcional.
- Banco/backend definitivo ainda não está fechado; Supabase, PocketBase, Node/Express/PostgreSQL ou outra solução só podem ser adotados por decisão explícita.
- Perfis de negócio: Admin, Gerente, Gestor, Financeiro e Manutenção.
- `Desenvolvedor` não é perfil de negócio.
- Prioridades atuais: autenticação/perfis, dashboard, residenciais/unidades, contratos e relatórios.
- Assinatura eletrônica não faz parte da primeira entrega acadêmica.
- CRM de WhatsApp é evolução futura, não escopo fechado do MVP.
- Inativação/exclusão de usuários não pode romper histórico auditável.

## Forma de trabalhar
Para tarefa relevante:
1. leia este arquivo e a Issue/especificação;
2. inspecione o estado real do repositório;
3. diferencie fato, hipótese e recomendação;
4. faça apenas o mínimo necessário ao escopo;
5. evite refatorações não relacionadas;
6. não avance automaticamente para outra missão.

Não instalar dependências por conveniência. Não escolher arquitetura, banco ou serviço externo sem decisão explícita ou escopo que autorize isso.

## Escalonamento para os chats do Projeto ChatGPT
Se surgir dúvida que dependa de regra de negócio, requisito, prioridade, UX esperada, documentação, arquitetura ou decisão de produto não registrada, PARE. Não invente nem escolha sozinho.

Explique:
- qual decisão/contexto falta;
- por que isso altera a implementação;
- opções possíveis, quando útil;
- qual domínio deve decidir.

Oriente o usuário a voltar ao chat adequado do Projeto ChatGPT: Backend para API/banco/regras; Frontend para UI/UX; Infra para Docker/deploy/VPS; Documentação para requisitos; Sprint para entrega acadêmica; Desenvolvimento Geral para arquitetura/prioridade transversal. Continue somente após receber a decisão/contexto.

Dúvidas puramente técnicas dentro do escopo, sem alterar produto ou arquitetura importante, podem ser resolvidas autonomamente e registradas quando relevantes.

## GitHub
Para mudanças relevantes, use a Issue como fonte de objetivo, escopo, restrições e critérios de aceite. Mantenha a mudança isolada e vincule PR à Issue quando aplicável. Microajustes não exigem Issue.

## Qualidade
Antes de concluir:
- execute testes relacionados;
- execute lint/type checking quando existirem;
- valide o comportamento real quando possível;
- confira `git diff`/estado da árvore;
- procure regressões e alterações fora do escopo;
- revise segurança quando houver autenticação, autorização, dados pessoais, uploads, banco, APIs ou permissões.

Código compilando não prova que o fluxo funciona.

## Segurança e LGPD
Nunca adicionar ou reproduzir secrets, senhas, tokens ou API keys. Se encontrar um secret, informe apenas existência e localização. Revise autorização por perfil, validação de entrada, exposição de dados, logs, operações destrutivas e implicações de LGPD quando aplicável.

## Entrega
Ao terminar, informe:
1. resumo do que foi feito/encontrado;
2. arquivos alterados;
3. testes/comandos executados;
4. decisões técnicas tomadas;
5. limitações e pendências;
6. critérios de aceite atendidos ou não;
7. sugestão do próximo passo, sem executá-lo.