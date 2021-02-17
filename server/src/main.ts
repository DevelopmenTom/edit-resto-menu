import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.use(helmet())
  app.use(
    rateLimit({
      max: 100,
      windowMs: 15 * 60 * 1000
    })
  )
  await app.listen(process.env.APP_PORT)
}
bootstrap()
