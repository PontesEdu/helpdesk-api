import { STATUS_CODES } from 'node:http'
import { hasZodFastifySchemaValidationErrors } from '@fastify/type-provider-zod'
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from './errors.ts'

function sendProblem(
  reply: FastifyReply,
  status: number,
  code: string,
  detail: string,
  extra: object = {},
) {
  return reply
    .status(status)
    .type('application/problem+json')
    .send({ title: STATUS_CODES[status], status, code, detail, ...extra })
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Erro de regra de negócio, lançado de propósito pelo nosso código.
  if (error instanceof AppError) {
    return sendProblem(reply, error.status, error.code, error.message)
  }

  // Dados da requisição não passaram no schema do Zod.
  if (hasZodFastifySchemaValidationErrors(error)) {
    const errors = error.validation.map((issue) => ({
      field: issue.instancePath.slice(1),
      message: issue.message,
    }))

    return sendProblem(
      reply,
      400,
      'VALIDATION_ERROR',
      'Dados da requisição inválidos.',
      { errors },
    )
  }

  // Erro do cliente detectado pelo Fastify, como JSON malformado.
  if (error.statusCode && error.statusCode < 500) {
    return sendProblem(reply, error.statusCode, error.code, error.message)
  }

  // Qualquer outro erro é falha nossa: registra tudo e responde sem detalhes.
  request.log.error(error)

  return sendProblem(
    reply,
    500,
    'INTERNAL_SERVER_ERROR',
    'Ocorreu um erro interno.',
  )
}

export function notFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  return sendProblem(
    reply,
    404,
    'ROUTE_NOT_FOUND',
    `Rota ${request.method} ${request.url} não encontrada.`,
  )
}
