import { Router } from "express";
import {
  atualizarStatusDaAlteracao,
  criarNovaAlteracao,
  listarAlteracoesPendentes,
} from "../controllers/alteracao.controller.js";

const router = Router();

router.get("/", listarAlteracoesPendentes);
router.post("/", criarNovaAlteracao);
router.patch("/:id/status", atualizarStatusDaAlteracao);

export default router;
