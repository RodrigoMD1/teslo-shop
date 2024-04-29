/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuid } from 'uuid'

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('file is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${uuid()}.${fileExtension}`;  // el uuid es para que se genere un id unico para las imagenes 

    callback(null, fileName);


}