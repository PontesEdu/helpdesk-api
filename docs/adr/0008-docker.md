# 0008. Compose em desenvolvimento, Dockerfile perto do deploy

**Status:** aceita. O estudante quer aprender e revisar Docker só no que este projeto precisa; a lição rápida entra na Fase 2.

**Contexto:** o código fica em `C:\Users\...`, caso em que a Docker desaconselha bind mounts pelo WSL. O deploy só será decidido na Fase 8.

**Decisão:** PostgreSQL no `compose.yaml` e API direto no Windows durante o desenvolvimento. Na Fase 8, Dockerfile multi-stage com base `trixie-slim`, usuário `node`, `CMD` em forma exec chamando `node` diretamente, `.dockerignore` e `prisma migrate deploy` uma vez por release.

**Armadilhas a respeitar:**

- PostgreSQL 18: o volume vai em `/var/lib/postgresql`, sem `/data`. Tutoriais antigos estão desatualizados.
- Publicar a porta como `127.0.0.1:5432:5432`, para não expor o banco na rede.
- Um PostgreSQL nativo no Windows pode ocupar a 5432 e causar erro de senha com o container saudável.
- As variáveis `POSTGRES_*` só valem com o diretório de dados vazio.
- `docker compose down -v` apaga os dados.
- Não usar `version:` no Compose, que é obsoleto, nem imagens da Bitnami.

**Fontes:** [imagem oficial do Postgres](https://hub.docker.com/_/postgres), [boas práticas com WSL](https://docs.docker.com/desktop/features/wsl/best-practices/), [referência do Compose](https://docs.docker.com/reference/compose-file/services/), [boas práticas do docker-node](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md).
