import {
  serializerCompiler,
  validatorCompiler,
} from '@fastify/type-provider-zod'
import fastify from 'fastify'
import { env } from './env.ts'
import { errorHandler, notFoundHandler } from './shared/error-handler.ts'

export const app = fastify({
  logger: env.NODE_ENV !== 'test',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)
app.setNotFoundHandler(notFoundHandler)

app.get('/health', async () => {
  return { status: 'ok' }
})
