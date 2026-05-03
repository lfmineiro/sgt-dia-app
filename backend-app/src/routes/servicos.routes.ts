import { Router } from "express";
import { criarServico, listarServicoAtual, listarServicos, atualizarServico } from "../controllers/servicos.controller.js";

const router = Router()

router.post('/', criarServico)
router.get('/', listarServicos)
router.get('/atual', listarServicoAtual)
router.patch('/:id', atualizarServico)

export default router