import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod'
import fastify, { type FastifyError } from 'fastify'
import { env } from './env.ts'
import { healthRoutes } from './modules/health/health.routes.ts'
import { AppError } from './shared/errors.ts'

export const app = fastify({
  logger: env.NODE_ENV !== 'test',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error: FastifyError, request, reply) => {
  // Erro que nós lançamos de propósito.
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  // Erro do cliente, como validação ou JSON malformado.
  if (error.statusCode && error.statusCode < 500) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  // Sobrou um bug nosso: registra tudo no log e não mostra detalhes ao cliente.
  request.log.error(error)
  return reply.status(500).send({ message: 'Erro interno do servidor.' })
})

// O Swagger precisa vir antes das rotas para conseguir enxergá-las.
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'HelpDesk API',
      description: 'API de gerenciamento de chamados de suporte.',
      version: '0.1.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, { routePrefix: '/docs' })

app.register(healthRoutes)
