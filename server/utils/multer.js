import multer from 'multer';

//store image in uploads folder
const upload=multer({
    dest: 'uploads/'});

export default upload;