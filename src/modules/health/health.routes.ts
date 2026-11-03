import type { FastifyPluginAsyncZod } from '@fastify/type-provider-zod'
import { z } from 'zod'

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        summary: 'Verifica se a API está no ar',
        tags: ['health'],
        response: {
          200: z.object({ status: z.string() }),
        },
      },
    },
    async () => {
      return { status: 'ok' }
    },
  )
}
