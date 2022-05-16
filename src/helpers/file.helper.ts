import { diskStorage } from 'multer';
import { Request } from 'express';

const fileName = (req: Request, file: Express.Multer.File, cb: Function) => {
    const name = file.originalname
        .split('.')[0]
        // .replace(' ', '')
        .toLowerCase();
    const fileExtension = file.originalname.split('.')[1];
    const newFileName =
        name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

    cb(null, newFileName);
}

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

export const imageUpload = {
    storage: diskStorage({
        destination: './uploads',
        filename: fileName
    }),
    fileFilter: fileFilter
} 