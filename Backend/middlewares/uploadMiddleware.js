import multer from "multer";
import path from "path";

// Configuração do storage (onde as imagens serão salvas)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salva as imagens em 'public/images'
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extensão do arquivo
    const filename = Date.now() + ext; // Nome único para o arquivo
    cb(null, filename);
  }
});

// Apenas aceita arquivos de imagem
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(new Error("Tipo de arquivo inválido. Apenas imagens são permitidas."), false);
  }
};

// Middleware de upload
const upload = multer({ storage, fileFilter });

export default upload;

