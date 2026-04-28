import { Router } from "express";
import { criarSped, obterSped, atualizarSped, obterTextoSped } from "../controllers/sped.controller.js";

const router = Router()

router.post('/sped', criarSped)
router.get('/:servicoId/sped/:companhia', obterSped)
router.put('/:servicoId/sped/:companhia', atualizarSped)
router.get('/:servicoId/sped/:companhia/texto', obterTextoSped)

export default router
