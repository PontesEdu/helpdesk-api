import { buildApp } from './app.ts'
import { env } from './env.ts'

const app = buildApp({ logger: true })

async function shutdown() {
  await app.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

try {
  await app.listen({ host: '0.0.0.0', port: env.PORT })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
