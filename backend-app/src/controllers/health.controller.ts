// Implementação do HealthCheck e do Status
// O HelthCheck vai retornar se o servidor está rodando, tal como a hora.
/* O status vai detalhar ainda mais a saúde da aplicação
- Ambiente: Desenvolvimento ou Produção
- upTime 
- Uso da memória 
- Banco de dados
Para monitorar possívei falhas do sistema
*/
import type { Request, Response } from "express";

export const getHealthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export const getStatus = (req: Request, res: Response) => {
  // heapUsed retorna o valor em bytes
  // transformamos o valor em MB  
  // No entregável 3, adicionaremos o teste de conexão com o banco de dados
  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024
  res.status(200).json({
    status: 'online',
    enviroment: process.env.NODE_ENV || 'development',
    uptime: `${uptime.toFixed(2)} s`,
    memoryUsage: `${memoryUsage.toFixed(2)} MB`,
  })
}