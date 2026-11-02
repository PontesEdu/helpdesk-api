# Planejamento

## Estado atual

**Fase 0, em andamento.** Base do projeto criada (Git local, npm, TypeScript), com validação de ambiente, Fastify com `/health` e primeiro teste. Repositório: github.com/PontesEdu/helpdesk-api. Próximos passos: lint e CI.

Atualize esta seção ao concluir cada etapa.

## MVP

Um solicitante abre um chamado, um agente o atende e tudo fica registrado.

**Tabelas:** `users`, `categories`, `tickets`, `ticket_comments`, `ticket_events`, `refresh_tokens`.

**Fluxo de status:**

```text
OPEN → IN_PROGRESS ⇄ WAITING_REQUESTER
            ↓
         RESOLVED → CLOSED
            ↓
       IN_PROGRESS (reabertura)
```

**Permissões:**

| Ação | Solicitante | Agente | Admin |
|---|---|---|---|
| Abrir chamado | sim | sim | sim |
| Ver chamados | só os próprios | todos | todos |
| Assumir ou atribuir | não | assumir | atribuir a qualquer agente |
| Alterar status | confirmar ou reabrir o próprio | conforme o fluxo | conforme o fluxo |
| Definir prioridade | não | sim | sim |
| Comentar | nos próprios | sim | sim |
| Comentário interno | não cria nem vê | sim | sim |
| Gerenciar usuários e categorias | não | não | sim |

**Regras:**

- O cadastro público cria apenas solicitantes; o primeiro admin vem de um seed.
- Toda alteração grava o chamado e o evento na mesma transação.
- Chamados não são apagados; usuários são desativados.
- Solicitante que tenta ver chamado alheio recebe 404, para não revelar que ele existe.
- Dois agentes assumindo o mesmo chamado: só um vence, o outro recebe 409.
- Listagem com filtros por status, prioridade, categoria, responsável e período, com paginação e ordenação estável.

**Fora do MVP:** anexos, e-mail, notificações, SLA, equipes, multiempresa, busca textual avançada, cache e filas.

## Roadmap

| Fase | Entrega | O estudante pratica | Critério para avançar |
|---|---|---|---|
| 0. Fundamentos | Repositório, TypeScript, env, lint, CI e `/health` | Validação de env; explicar event loop e async/await | CI verde; explica cada script |
| 1. HTTP | `buildApp`, handler de erros, logs e OpenAPI | Mapear erros para status | Testes de 400, 404 e 500 |
| 2. SQL | Postgres no Compose (com lição rápida de Docker), modelagem e migrations | `SELECT`, `JOIN` e `EXPLAIN` à mão; `compose.yaml` | Justifica cada índice e constraint |
| 3. Usuários e autenticação | Cadastro, login, refresh, logout e perfis | Teste de token revogado | Reuso de refresh token detectado em teste |
| 4. Chamados | Módulos, CRUD, fluxo de status e permissões | `canTransition`; política `canViewTicket` | Matriz de permissões inteira testada |
| 5. Interações | Comentários, histórico, transação e concorrência | Teste de dois agentes simultâneos | Nenhuma alteração sem evento |
| 6. Consultas | Filtros, paginação e índices | Um filtro completo, com teste | `EXPLAIN` com volume realista |
| 7. Segurança | Rate limit, Helmet, CORS e revisão OWASP | Revisar a API pelo OWASP | Checklist fechado |
| 8. Produção | Dockerfile, deploy, secrets, migrations e observabilidade | Pipeline de deploy; simular rollback | API publicada e documentada |
| 9. Avançado | Só com motivo real, como e-mail com fila | Decidir o que vale a pena | Justificativa escrita |

Autenticação vem antes dos chamados porque as permissões dependem de saber quem é o usuário.

## O que corrigir em relação ao projeto antigo

O `03-api-solid` (github.com/PontesEdu/03-api-solid) é a referência de nível do estudante. Pontos a trabalhar:

- Handler de erros que transforma erros de domínio, JSON malformado e refresh sem cookie em 500, e não registra nada em produção.
- Access e refresh token intercambiáveis, sem revogação e com `role` copiado a cada refresh.
- Autorização só por perfil, sem verificar o objeto (BOLA).
- Consulta seguida de escrita sem constraint ou transação; violações viram 500.
- FKs sem índice, paginação sem `orderBy`, datas sem fuso, migration que apaga coluna em vez de renomear.
- Testes e2e só de caminho feliz; repositórios em memória que escondem problemas de SQL.
- Sem `tsc --noEmit` nem lint na CI; bcrypt com custo 6.

Pontos fortes a preservar: separação entre HTTP e regra de negócio, injeção pelo construtor, erros de domínio próprios, testes com tempo controlado, validação de env e requisitos no README.

## Lacunas conhecidas

- Não há dado confiável de vagas por framework nem do LinkedIn (acesso bloqueado na pesquisa de 02/11/2026). No Brasil, a Pesquisa Salarial Código Fonte TV 2025 sugere peso relevante do NestJS. Depois do projeto: exercício curto em Express e amostra manual de 50 a 100 vagas júnior.
- O deploy será decidido na Fase 8.
