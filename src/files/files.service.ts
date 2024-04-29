import { join } from 'path';
import { existsSync } from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';




@Injectable()
export class FilesService {


    getStaticProductImage(imageName: string) {

        const path = join(__dirname, '../../static/products', imageName) // esto verifica que el archivo exista sin importar que tipo de dato es o archivo

        if (!existsSync(path))
            throw new BadRequestException(`no product found with image ${imageName}`);

        return path   

    }



}
