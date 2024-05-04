import { Controller, Post, Body, Get, UseGuards, Req, Headers, SetMetadata, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetRawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';





@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User, // esto para pedir toda la info completa 
    @GetUser('email') userEmail: string,// esto para pedir una info en especifico 

    @GetRawHeaders() rawHeaders: string[], // el proximo que es headers es lo mismo pero capaz un poco mas util y ya esta hecho por otros 
    @Headers() headers: IncomingHttpHeaders, // este es mas util y parece que voy a usar mas este 

  ) {

    console.log(request);


    return {
      ok: true,
      message: 'holaa',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user',])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }


}
