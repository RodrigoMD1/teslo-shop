import { Controller, Post, Body, Get, UseGuards, Req, Headers, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetRawHeaders, Auth } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';





@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }



  ////////////////////////////////////////////////////////////////////
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  ////////////////////////////////////////////////////////////////////
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  ////////////////////////////////////////////////////////////////////

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
  }




  ////////////////////////////////////////////////////////////////////
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User, // esto para pedir toda la info completa 
    @GetUser('email') userEmail: string,// esto para pedir una info en especifico 

    @GetRawHeaders() rawHeaders: string[], // el proximo que es headers es lo mismo pero capaz un poco mas util y ya esta hecho por otros 
    @Headers() headers: IncomingHttpHeaders, // este es mas util y parece que voy a usar mas estee

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
  ////////////////////////////////////////////////////////////////////
  //@SetMetadata('roles', ['admin', 'super-user',])

  // ESTO SERIA QUE EN LA PAGINA PRIVATE 2 SOLO LOS QUE TIENEN RANGO DE ADMINISTRADOR PUEDEN VERLO  mientras que el resto no 
  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin) // esto seria que necesita uno de esos dos para poder ver la pagina private2
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
  ////////////////////////////////////////////////////////////////////

  @Get('private3')
  @Auth(ValidRoles.admin) // esto es lo mismo pero mas resumido de la linea 63 hace lo mismo pero la logica esta en auth.decorator
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }


}
