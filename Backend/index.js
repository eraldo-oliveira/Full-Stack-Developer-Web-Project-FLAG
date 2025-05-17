
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Cors
app.use(cors({
  origin: '*', // Permite todas as origens (ajuste conforme necessário)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

// Middleware
app.use(express.json());

// Conexão com o MongoDB
connectDB();

// Rotas
app.use('/recipes', recipeRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('API de Receitas está funcionando!');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
