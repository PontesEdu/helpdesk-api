import type { ZodTypeProvider } from '@fastify/type-provider-zod'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { app } from './app.ts'
import { AppError } from './shared/errors.ts'

beforeAll(async () => {
  // Rotas que existem só neste teste, para provocar cada tipo de erro.
  app.get('/test/app-error', async () => {
    throw new AppError(404, 'Chamado não encontrado.')
  })

  app.get('/test/unexpected-error', async () => {
    throw new Error('senha do banco vazou')
  })

  app.withTypeProvider<ZodTypeProvider>().post(
    '/test/validation',
    {
      schema: {
        body: z.object({ title: z.string().min(3) }),
      },
    },
    async (request) => {
      return { title: request.body.title }
    },
  )

  await app.ready()
})

afterAll(() => app.close())

describe('GET /health', () => {
  it('responde 200 com status ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })

  it('aparece na documentação OpenAPI', async () => {
    const response = await app.inject({ method: 'GET', url: '/docs/json' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty(['paths', '/health'])
  })
})

describe('tratamento de erros', () => {
  it('responde AppError com seu status e mensagem', async () => {
    const response = await app.inject({ url: '/test/app-error' })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({ message: 'Chamado não encontrado.' })
  })

  it('responde 500 sem vazar detalhes do erro', async () => {
    const response = await app.inject({ url: '/test/unexpected-error' })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({ message: 'Erro interno do servidor.' })
  })

  it('responde 400 quando o body é inválido', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/test/validation',
      body: { title: 'a' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toContain('body/title')
  })

  it('responde 400 para JSON malformado', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/test/validation',
      headers: { 'content-type': 'application/json' },
      body: '{ "title": ',
    })

    expect(response.statusCode).toBe(400)
  })

  it('responde 404 em rota inexistente', async () => {
    const response = await app.inject({ url: '/nao-existe' })

    expect(response.statusCode).toBe(404)
  })
})
