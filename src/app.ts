import fastify, { type FastifyServerOptions } from 'fastify'

export function buildApp(options: FastifyServerOptions = {}) {
  const app = fastify(options)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return app
}
