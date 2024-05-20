import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';




@Module({
  imports: [ConfigModule.forRoot(),

  TypeOrmModule.forRoot({
    type: 'postgres',
    // host: process.env.DB_HOST, // es el localhost pero esta definido en .env
    // port: +process.env.DB_PORT,
    //database: process.env.DB_NAME,
    //username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    url: process.env.DB_URL,
    //ssl: true,
    autoLoadEntities: true,
    synchronize: true,  // cuando este en produccion este no lo voy a querer usar puede que no se necesito o sI, cuando borro alguna columna automaticamente la sincroniza
    logger: 'debug'
  }),

  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule,

    MessagesWsModule,

  ],



})
export class AppModule { }
