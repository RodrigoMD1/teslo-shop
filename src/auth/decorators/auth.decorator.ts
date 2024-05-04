/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';



export function Auth(...roles: ValidRoles[]) {

    return applyDecorators(
        RoleProtected( ValidRoles.superUser,ValidRoles.admin), // esto seria que necesita uno de esos dos para poder ver la pagina private2
        UseGuards(AuthGuard(), UserRoleGuard),

    );
}