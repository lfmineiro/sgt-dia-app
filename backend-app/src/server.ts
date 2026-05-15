import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import healthRoutes from './routes/health.routes.js'
import alunosRoutes from './routes/alunos.routes.js'
import servicosRoutes from './routes/servicos.routes.js'
import escalasRoutes from './routes/escalas.routes.js'
import alteracoesRoutes from './routes/alteracoes.routes.js'
import spedRoutes from './routes/sped.routes.js'
import avisosRoutes from './routes/avisos.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use('/', healthRoutes)
app.use('/api/alunos', alunosRoutes)
app.use('/api/servicos', servicosRoutes)
app.use('/api/servicos', spedRoutes)
app.use('/api/escalas', escalasRoutes)
app.use('/api/alteracoes', alteracoesRoutes)
app.use('/api/avisos', avisosRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World! Vendo se Atualiza');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
