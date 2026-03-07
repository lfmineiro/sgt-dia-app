import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRoutes from './routes/health.router.js'

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes)

app.get('/', (req, res) => {
  res.send('Hello World! Vendo se Atualiza');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})