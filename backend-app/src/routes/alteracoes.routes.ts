import { Router } from "express";
import {
  atualizarStatusDaAlteracao,
  criarNovaAlteracao,
  listarAlteracoesPendentes,
  uploadFotoAlteracao,
} from "../controllers/alteracao.controller.js";
import { uploadImagem } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", listarAlteracoesPendentes);
router.post("/", criarNovaAlteracao);
router.post("/upload", uploadImagem.single("foto"), uploadFotoAlteracao);
router.patch("/:id/status", atualizarStatusDaAlteracao);

export default router;
