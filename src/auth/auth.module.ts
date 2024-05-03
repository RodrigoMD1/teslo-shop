import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),


    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // console.log('JWT Secret', configService.get('JWT_SECRET'));
        // console.log('JWT SECRET', process.env.JWT_SECRET);

        return {
          // al final de la linea 28 puedo poner || para cuando no este el secret y que salte algun error que no esta o no lo escribieron 
          secret: configService.get('JWT_SECRET'),// TODO preguntar por este secret que no entendi para que sirve y por que no lo deberia tener casi nadie esto 
          signOptions: {
            expiresIn: '3h'
          }
        }
      }
    })



  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule { }



// TODO preguntar sober .env que no entiendo cuando esta el template deberia tener info de lo que va env pero no va la info correct como por ejemplo esa parte secreta de jwt no entiendo mucho eso , tambien preguntar por la funcion flecha nunca la puedo entender para que se usar y en que casos de usa 