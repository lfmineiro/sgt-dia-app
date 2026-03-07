// Implementação do HealthCheck e do Status
// O HelthCheck vai retornar se o servidor está rodando, tal como a hora.
/* O status vai detalhar ainda mais a saúde da aplicação
- Ambiente: Desenvolvimento ou Produção
- upTime 
- Uso da memória 
- Banco de dados
*/
import type { Request, Response } from "express";

 

export const getHealthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}