 // upload the one image on heroImage form admin panel to frontend...
import multer from 'multer';

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
