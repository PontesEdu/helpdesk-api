# 0002. Fastify 5

**Status:** aceita. NestJS e Hono foram descartados por enquanto, por serem avançados demais para este momento.

**Contexto:** o estudante prefere Fastify a Express e já o usou. Fastify tem manutenção ativa e está na OpenJS Foundation. Express segue bem mais usado: 15,6% contra 3,5% no Stack Overflow 2026 (amostra de 10.281). No State of JS 2025, a satisfação é de 86% para Fastify e 81% para Express.

**Decisão:** Fastify 5, não a v6 alpha. Validação e schemas com Zod 4 e `@fastify/type-provider-zod`; OpenAPI com `@fastify/swagger`.

**Consequências:** menos correspondência literal com palavras-chave de vagas. HTTP, testes, SQL e autenticação se transferem para qualquer framework. Depois do projeto, fazer um exercício curto em Express. A tabela de LTS lida não confirmou o Node 24 para o Fastify 5; verificar na instalação.

**Fontes:** [Stack Overflow 2026](https://survey.stackoverflow.co/2026/technology/data/web-framework), [State of JS 2025](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/), [LTS do Fastify](https://fastify.dev/docs/latest/Reference/LTS/), [Código Fonte TV 2025](https://pesquisa.codigofonte.com.br/2025/area/backend).
