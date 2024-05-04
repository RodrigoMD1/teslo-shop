import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";



export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user

        if (!user)
            throw new InternalServerErrorException('user not found (request)');



        return (!data) ? user : user[data];  // esto es para cuando no le pongo una condicion de que quiero por ejemplo solo el email entonces que envie todo la info completa 
    }
)

