import multer from 'multer';

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

export const uploadImgMulter = (req, res, next) => {
    upload.single('avatar')(req, res, (error) => {
        if (error) return res.status(400).send({ error: error.message });
        next();
    });
};
