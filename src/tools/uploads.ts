import del = require('del');

const imageFilter = function (req:any, file:any, cb:any) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const automlFilter = function (req:any, file:any, cb:any) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const cleanFolder = function (folderPath:string) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};



export { imageFilter, cleanFolder }