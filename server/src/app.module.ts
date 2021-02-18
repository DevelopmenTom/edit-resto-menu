import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'

import { AuthModule } from './auth/auth.module'
import { MenuModule } from './menu/menu.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? join(process.cwd(), 'test.env')
          : undefined,
      isGlobal: true
    }),
    AuthModule,
    MenuModule
  ]
})
export class AppModule {}
