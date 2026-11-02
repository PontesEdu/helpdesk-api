import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod'
import fastify from 'fastify'
import { env } from './env.ts'
import { healthRoutes } from './modules/health/health.routes.ts'
import { errorHandler, notFoundHandler } from './shared/error-handler.ts'

export const app = fastify({
  logger: env.NODE_ENV !== 'test',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)
app.setNotFoundHandler(notFoundHandler)

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
