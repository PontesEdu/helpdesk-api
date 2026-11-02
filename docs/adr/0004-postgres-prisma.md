# 0004. PostgreSQL 18 e Prisma 7

**Status:** aceita. É a decisão mais discutível da stack; o Drizzle era a alternativa principal.

**Contexto:** o estudante já conhece Prisma. Prisma 8 ainda é release candidate. Drizzle está em `0.45`, com `1.0` em RC.

**Decisão:** PostgreSQL 18 com a imagem oficial `postgres`. Prisma 7 com versões fixadas, depois de praticar SQL à mão e lendo cada migration gerada.

**Consequências:**

- `npm install prisma` sem versão instalava o RC do Prisma 8 em 02/11/2026. Instalar `prisma@7`, `@prisma/client@7` e `@prisma/adapter-pg@7`, conferindo antes no npm.
- O Prisma 7 usa o provider `prisma-client` com `output` obrigatório, driver adapter e `prisma.config.ts`, e não carrega `.env` sozinho. Consultar as páginas `/orm/v7/` da documentação; as páginas sem versão podem já descrever o v8.
- Migrar para o Prisma 8 depois do lançamento estável, em tarefa própria.

**Fontes:** [upgrade para o Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7), [status de lançamento do Prisma](https://www.prisma.io/docs/orm/release-status), [versões do PostgreSQL](https://www.postgresql.org/support/versioning/).
