# 0003. Monólito modular leve

**Status:** aceita. Julgamento baseado em opiniões convergentes; nenhuma fonte mediu projetos deste porte.

**Contexto:** monólito modular e MVC/camadas não são excludentes. O primeiro divide o sistema entre módulos de negócio; as camadas organizam cada módulo. A escolha real é o critério do primeiro nível de pastas. Camadas por tipo não são erradas, e projetos grandes usam as duas formas.

**Decisão:**

```text
src/
  server.ts          # só abre a porta
  app.ts             # monta plugins e módulos
  plugins/
  shared/            # só o realmente genérico
  modules/
    tickets/
      index.ts               # interface pública do módulo
      tickets.routes.ts      # HTTP e schemas
      use-cases/             # ações do sistema
      ticket.ts              # regras puras
      tickets.repository.ts  # único lugar com Prisma no módulo
```

Regras: de fora, importar só o `index.ts` do módulo (`no-restricted-imports` no ESLint, ligado quando existir o segundo módulo); só o módulo dono escreve nas próprias tabelas; dependências sem ciclos; um banco, um `schema.prisma` e FKs entre módulos permitidas. Só criar interface de repositório quando houver necessidade real.

**Fora por enquanto:** eventos entre módulos, container de DI, schemas Postgres por módulo, CQRS, Clean Architecture completa e microsserviços.

**Consequências:** se dois módulos sempre mudam juntos, fundi-los ou redesenhar o limite. Se tudo cair em `shared/`, falta um módulo. Se só houver cerimônia, simplificar.

**Fontes:** [Fowler sobre camadas](https://martinfowler.com/bliki/PresentationDomainDataLayering.html), [Fowler, MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html), [nodebestpractices](https://github.com/goldbergyoni/nodebestpractices), [Shopify, 2019](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity), [retrospectiva do Packwerk](https://shopify.engineering/a-packwerk-retrospective).
