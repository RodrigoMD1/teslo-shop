import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),


    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET, // TODO preguntar por este secret que no entendi para que sirve y por que no lo deberia tener casi nadie esto 
          signOptions: {
            expiresIn: '3h'
          }
        }
      }
    })
  


  ],
  exports: [TypeOrmModule]
})
export class AuthModule { }



// TODO preguntar sober .env que no entiendo cuando esta el template deberia tener info de lo que va env pero no va la info correct como por ejemplo esa parte secreta de jwt no entiendo mucho eso , tambien preguntar por la funcion flecha nunca la puedo entender para que se usar y en que casos de usa 