import { Router } from "express";
import { criarServico, listarServicoAtual, listarServicos } from "../controllers/servicos.controller.js";

const router = Router()

router.post('/', criarServico)
router.get('/', listarServicos)
router.get('/atual', listarServicoAtual)

export default router