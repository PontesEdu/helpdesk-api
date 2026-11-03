# 0010. Tratamento de erros simples e logs com Pino

**Status:** aceita. Substitui a [0007](0007-erros-logs.md).

**Contexto:** o formato RFC 9457, com `code` em cada erro e funções auxiliares, funcionava, mas era mais complexo do que o estudante consegue explicar neste momento. O MVP tem um único cliente e nada exige esse formato. Centralizar os erros continua necessário, porque o padrão do Fastify pode vazar texto interno em um 500.

**Decisão:**

- `setErrorHandler` em `src/app.ts`, respondendo `{ message }`, com três casos: `AppError` lançado por nós, erro do cliente com status menor que 500 e qualquer outro erro, que vira 500 sem detalhes e vai para o log.
- `AppError` guarda apenas `statusCode` e `message`.
- Rota inexistente continua com a resposta padrão do Fastify.
- Logs JSON em stdout com o Pino embutido no Fastify, `redact` de `authorization` e cookies, e ID de requisição gerado no servidor.
- Registrar falhas de login, acessos negados e ações administrativas, sem senhas nem tokens.

**Consequências:** menos código e nada novo para aprender agora. As mensagens de validação e de JSON malformado vêm em inglês, e a resposta de 404 tem campos a mais que as outras. Se um cliente precisar diferenciar erros por código, ou se o handler crescer, reavaliar em um novo ADR.

**Fontes:** [erros no Fastify](https://fastify.dev/docs/latest/Reference/Errors/), [logs no Fastify](https://fastify.dev/docs/latest/Reference/Logging/), [OWASP, logs](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
