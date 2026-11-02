# 0001. Node 24 e TypeScript 6 com type stripping

**Status:** aceita.

**Contexto:** o Node 24 já está instalado. Em 02/11/2026 ele está em manutenção até 30/04/2028, e o 26 é a LTS mais recente. O TypeScript 7.0.2 existe, mas o `typescript-eslint` 8.72 exige `<6.1.0`.

**Decisão:**

- Node 24, trocando só se houver problema concreto.
- TypeScript 6.0.3, para ter lint baseado em tipos com ESLint.
- ESM e execução com o type stripping nativo do Node em desenvolvimento; `tsc` para verificar tipos e gerar o build. `tsx` é o plano B se o Prisma ou outra ferramenta não funcionar.
- npm como gerenciador de pacotes, com versões exatas.
- `.env` carregado com `dotenv` (`import 'dotenv/config'`). A flag `--env-file` do Node também é estável desde a 24.10, mas o Prisma 7 precisa carregar o `.env` no `prisma.config.ts`, e o exemplo oficial usa `dotenv`. Assim há um único mecanismo, conhecido pela maioria dos devs.

**Consequências:** só sintaxe apagável (`erasableSyntaxOnly`), sem `enum` nem `constructor(private x)`. Imports locais usam a extensão `.ts`. O type stripping não verifica tipos, então `npm run typecheck` é obrigatório na CI.

**Fontes:** [calendário de LTS do Node](https://github.com/nodejs/Release), [TypeScript no Node](https://nodejs.org/api/typescript.html).
