import { Router } from "express";
import { criarAluno, listarAlunos } from "../controllers/alunos.controller.js";

const router = Router()

router.post('/', criarAluno)
router.get('/', listarAlunos)

export default router
