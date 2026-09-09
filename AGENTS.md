# Gestao_Residencial_Site — Instruções para agentes

## Objetivo do projeto
Sistema web de gestão do Bueno Residence, desenvolvido como projeto acadêmico com possibilidade de evolução para uso real.

O repositório definitivo é `Michelpjf/Gestao_Residencial_Site`.

## Estado atual
- O frontend existente está em `frontend/`.
- O frontend já está modularizado.
- O frontend atual não possui etapa de build.
- Não assumir que existe backend funcional.
- Não assumir que PocketBase, Supabase, Node/Express, PostgreSQL ou outra solução já foi definitivamente escolhida.
- Não substituir decisões atuais por informações antigas encontradas em documentos acadêmicos.

## Prioridades funcionais atuais
1. Autenticação e perfis.
2. Dashboard.
3. Residenciais e unidades.
4. Geração de contratos.
5. Relatórios.

Perfis de negócio atuais:
- Admin
- Gerente
- Gestor
- Financeiro
- Manutenção

Não tratar `Desenvolvedor` como perfil de negócio.

## Forma de trabalhar
Antes de implementar uma mudança relevante:
1. inspecionar o código existente;
2. identificar dependências e integrações reais;
3. separar fatos encontrados de suposições;
4. definir o menor plano capaz de atender à missão;
5. executar apenas mudanças necessárias para a missão atual.

Não reescrever código funcional sem necessidade.
Não instalar bibliotecas ou ferramentas apenas porque podem ser úteis.
Não escolher banco, framework, arquitetura ou serviço externo sem que a decisão já esteja estabelecida ou faça parte explicitamente da missão.
Não avançar automaticamente para a próxima funcionalidade após concluir a missão atual.

## Issues e mudanças relevantes
Para correções, melhorias ou funcionalidades relevantes:
- usar a Issue correspondente como fonte do escopo e dos critérios de aceite;
- manter a mudança isolada quando apropriado;
- evitar alterações não relacionadas;
- preservar comportamento existente quando ele não fizer parte da missão;
- vincular o PR à Issue quando houver PR.

Microajustes não precisam virar Issue.

## Qualidade
Antes de declarar uma missão concluída:
- executar os testes disponíveis relacionados à mudança;
- executar lint/type checking quando existirem;
- verificar erros produzidos pelas alterações;
- conferir o diff;
- procurar regressões óbvias;
- informar exatamente o que foi validado e o que não pôde ser validado.

Código compilando ou carregando não prova sozinho que o fluxo funciona.

## Segurança
Mudanças envolvendo autenticação, autorização, usuários, dados pessoais, uploads, banco ou APIs devem revisar:
- autorização por perfil;
- validação de entradas;
- exposição de dados pessoais;
- secrets e credenciais;
- logs;
- operações destrutivas;
- implicações de LGPD.

Nunca adicionar secrets, senhas, tokens ou API keys ao repositório.
Se um secret for encontrado durante auditoria, não reproduzi-lo em relatórios ou comentários; registrar apenas existência e localização.

## Regras de domínio já consolidadas
- Perfis de negócio: Admin, Gerente, Gestor, Financeiro e Manutenção.
- Financeiro é perfil próprio.
- Manutenção substitui o antigo perfil de negócio `Desenvolvedor` presente em documentação acadêmica antiga.
- Inativação/exclusão de usuários nunca deve romper histórico auditável.
- Ações relevantes devem gerar trilha de auditoria quando o backend suportar isso.
- Assinatura eletrônica não pertence à primeira entrega acadêmica.
- CRM de WhatsApp é evolução futura, não escopo fechado do MVP atual.

## Prioridade entre fontes
Quando houver conflito:
1. a Issue/tarefa atual tem prioridade para o escopo específico;
2. decisões atuais registradas no projeto têm prioridade sobre documentação acadêmica antiga;
3. o código real tem prioridade para descrever o estado atual da implementação;
4. não inferir que um item planejado está concluído sem verificar o repositório.

## Entrega esperada do agente
Ao terminar uma missão, informar:
1. resumo do que encontrou/fez;
2. arquivos alterados;
3. decisões tomadas;
4. testes e validações executados;
5. problemas encontrados;
6. pendências ou incertezas;
7. sugestão do próximo passo, sem executá-lo automaticamente.
