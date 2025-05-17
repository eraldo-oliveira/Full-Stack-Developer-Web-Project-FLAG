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

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));


app.use(express.json());

connectDB();

app.use('/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.send('API de Receitas está funcionando!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
