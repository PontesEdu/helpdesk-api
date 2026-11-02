# 0006. Vitest com banco real

**Status:** aceita.

**Contexto:** no projeto antigo, os testes e2e só cobriam sucesso, e os repositórios em memória não exercitavam SQL. As fontes não têm consenso sobre pirâmide ou "diamante", mas convergem em poucos E2E e em preferir implementação real a mock.

**Decisão:** Vitest 5. Testes de integração pela API com `app.inject()` contra PostgreSQL real, com schema criado por migrations. Cobrir caminho feliz, validação, 401/403, 404 e transições. Testes unitários só para regras puras. Não mockar o Prisma em testes de rota. Sem meta rígida de cobertura.

**Consequências:** testes mais lentos que em memória, em troca de pegar erros de constraint, transação e migration. A CI precisa de um PostgreSQL como service container.

**Fontes:** [testes no Fastify](https://fastify.dev/docs/latest/Guides/Testing/), [Goldberg, integração](https://github.com/testjavascript/nodejs-integration-tests-best-practices), [livro do Google, test doubles](https://abseil.io/resources/swe-book/html/ch13.html), [migração do Vitest](https://vitest.dev/guide/migration).
