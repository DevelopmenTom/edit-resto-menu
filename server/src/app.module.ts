import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { MenuModule } from './menu/menu.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, MenuModule]
})
export class AppModule {}
