import type { ZodTypeProvider } from '@fastify/type-provider-zod'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { app } from '../app.ts'
import { AppError } from './errors.ts'

describe('tratamento de erros', () => {
  beforeAll(async () => {
    // Rotas que existem só neste teste, para provocar cada tipo de erro.
    app.get('/test/app-error', async () => {
      throw new AppError(404, 'TICKET_NOT_FOUND', 'Chamado não encontrado.')
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

  it('responde AppError com seu status e code', async () => {
    const response = await app.inject({ url: '/test/app-error' })

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain(
      'application/problem+json',
    )
    expect(response.json()).toEqual({
      title: 'Not Found',
      status: 404,
      code: 'TICKET_NOT_FOUND',
      detail: 'Chamado não encontrado.',
    })
  })

  it('responde 500 sem vazar detalhes do erro', async () => {
    const response = await app.inject({ url: '/test/unexpected-error' })

    expect(response.statusCode).toBe(500)
    expect(response.body).not.toContain('senha do banco')
    expect(response.json()).toMatchObject({ code: 'INTERNAL_SERVER_ERROR' })
  })

  it('responde 400 indicando o campo inválido', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/test/validation',
      body: { title: 'a' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({
      code: 'VALIDATION_ERROR',
      errors: [{ field: 'title' }],
    })
  })

  it('responde 400 para JSON malformado', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/test/validation',
      headers: { 'content-type': 'application/json' },
      body: '{ "title": ',
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({ status: 400 })
  })

  it('responde 404 no mesmo formato em rota inexistente', async () => {
    const response = await app.inject({ url: '/nao-existe' })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toMatchObject({
      status: 404,
      code: 'ROUTE_NOT_FOUND',
    })
  })
})
