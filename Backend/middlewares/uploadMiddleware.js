import multer from "multer";
import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname); 
//     const filename = Date.now() + ext; 
//     cb(null, filename);
//   }
// });

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true); 
  } else {
    cb(new Error("Tipo de arquivo inválido. Apenas imagens são permitidas."), false);
  }
};

// const upload = multer({ storage, fileFilter });
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter
});

export default upload;

