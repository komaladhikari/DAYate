import multer from 'multer';

const storage = multer.diskStrorage({
    filename: function (req , file, callback){
        callback(null, file.originalname);
    }
});

const upload = multer({storage: storage});

export default upload;