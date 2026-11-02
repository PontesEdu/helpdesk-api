import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from './app.ts'

describe('GET /health', () => {
  beforeAll(() => app.ready())
  afterAll(() => app.close())

  it('responde 200 com status ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ status: 'ok' })
  })

  it('responde 404 em rota inexistente', async () => {
    const response = await app.inject({ method: 'GET', url: '/nao-existe' })

    expect(response.statusCode).toBe(404)
  })
})
