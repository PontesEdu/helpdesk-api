# 0005. JWT curto, refresh opaco e Argon2id

**Status:** aceita.

**Contexto:** no projeto antigo, access e refresh token tinham o mesmo formato e o mesmo segredo, sem revogação. O `@fastify/jwt` também lê o cookie configurado quando não há header `Authorization`, então o refresh de 7 dias acessava qualquer rota.

**Decisão:**

- Access token JWT de vida curta, aceito apenas pelo header `Authorization`.
- Refresh token opaco e aleatório, guardado como hash em `refresh_tokens`, com rotação e detecção de reuso, em cookie `HttpOnly`, `Secure` e `SameSite`.
- Senhas com Argon2id via `@node-rs/argon2`, com no mínimo m=19 MiB, t=2, p=1. O `crypto.argon2` nativo ainda é release candidate.
- Autorização em duas etapas: perfil e política sobre o objeto (`canViewTicket`), para evitar BOLA.

**Consequências:** mais código que um JWT puro, mas com logout e revogação reais. Trocar de perfil passa a valer no próximo refresh.

**Fontes:** [OWASP, senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [OWASP, sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP, JWT](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html), [OWASP, BOLA](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization).
