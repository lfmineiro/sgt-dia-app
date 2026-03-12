import { Router } from "express";
import { atualizarAluno, criarAluno, deletarAluno, listarAlunos } from "../controllers/alunos.controller.js";

const router = Router()

router.post('/', criarAluno)
router.get('/', listarAlunos)
router.put("/:numero", atualizarAluno);
router.delete("/:numero", deletarAluno);

export default router
