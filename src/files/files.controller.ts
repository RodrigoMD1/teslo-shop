import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';




@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  /////////////////////////////////////////////////////////////////////////////////

  @Get('product/:imageName')

  findProductImage(
    @Res() res: Response,  // este decorador hace que nest no tome el control y que vos manualmente voy a emitir mi respuesta CUIDADO CON ESTE 
    @Param('imageName') imageName: string) {


    const path = this.filesService.getStaticProductImage(imageName);


    res.sendFile(path);
    
    //res.status(403).json({
    // ok: false,
    // path: path
    //   })   con ese res.status tengo el control total de la respuesta ,esto se salta interceptorres y ciertas funciones de nestjs USARLO con CUIDADO

  }

  /////////////////////////////////////////////////////////////////////////////////

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits:{fileSize:10000} limite para los archivos control y espacio tengo mas opciones 
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))

  /////////////////////////////////////////////////////////////////////////////////

  uploadProductImage(
    @UploadedFile() file: Express.Multer.File // recomendacion para proyectos tranquis usar eso pero sino usar una base de datos aparte para las imagenes ej:puede ser en clouddinary o otra cloud 
  ) {

    if (!file) {
      throw new BadRequestException('make sure that the file is an image')
    }

    const secureUrl = `${file.filename}`;

    return { secureUrl }

  }
}
/////////////////////////////////////////////////////////////////////////////////