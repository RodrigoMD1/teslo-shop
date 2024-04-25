import { IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

//* DTO INFORMACION QUE LE VA A ENVIAR A LA BASE DE DATOS 
export class CreateProductDto {

    ///////////////////////////////////////////////////////

    @IsString()
    @MinLength(1)
    title: string;

    ///////////////////////////////////////////////////////

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    ///////////////////////////////////////////////////////

    @IsString()
    @IsOptional()
    description?: string;

    ///////////////////////////////////////////////////////

    @IsString()
    @IsOptional()
    slug?: string;

    ///////////////////////////////////////////////////////

    @IsNumber()
    @IsOptional()
    @IsPositive()
    stock?: number;

    ///////////////////////////////////////////////////////

    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    ///////////////////////////////////////////////////////

    @IsIn(['men', 'women', 'kid', 'unisex'])
    @IsString()
    gender: string;

    ///////////////////////////////////////////////////////
    // Cuando quiera agregar una parte nueva por ejemplo un tag y que se pueda poner eso en la base de datos tengo que hacerlo desde aca el DTO
    //primero ponerlo en la base de datos que es el entity y despues en el dto 
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];
    ///////////////////////////////////////////////////////

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

    ///////////////////////////////////////////////////////
}
