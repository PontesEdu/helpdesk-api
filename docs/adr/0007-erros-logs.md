# 0007. RFC 9457 e logs com Pino

**Status:** aceita.

**Contexto:** por padrão, o Fastify devolve `error.message` em qualquer status, o que pode vazar texto do banco em um 500. O RFC 9457 é um padrão IETF, mas o próprio texto aceita formatos próprios, e sua adoção não foi medida; é uma escolha deste projeto.

**Decisão:**

- `setErrorHandler` central, implementado à mão, respondendo em `application/problem+json`, com um `code` estável como `TICKET_NOT_FOUND`.
- Erros esperados (de domínio) mapeados para status; inesperados viram 500 sem detalhe interno e são registrados.
- Logs JSON em stdout com o Pino embutido no Fastify, `redact` de `authorization` e cookies, e ID de requisição gerado no servidor.
- Registrar falhas de login, acessos negados e ações administrativas, sem senhas nem tokens.

**Consequências:** cerca de 30 a 50 linhas próprias, sem plugin. OpenTelemetry e tracing ficam para depois.

**Fontes:** [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html), [erros no Fastify](https://fastify.dev/docs/latest/Reference/Errors/), [logs no Fastify](https://fastify.dev/docs/latest/Reference/Logging/), [OWASP, logs](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).
