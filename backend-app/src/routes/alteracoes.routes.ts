import { Router } from "express";
import {
  atualizarDadosDaAlteracao,
  atualizarStatusDaAlteracao,
  criarNovaAlteracao,
  listarAlteracoesTodas,
  uploadFotoAlteracao,
  removerAlteracao,
} from "../controllers/alteracao.controller.js";
import { uploadImagem } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", listarAlteracoesTodas);
router.post("/", criarNovaAlteracao);
router.post("/upload", uploadImagem.single("foto"), uploadFotoAlteracao);
router.patch("/:id", atualizarDadosDaAlteracao);
router.patch("/:id/status", atualizarStatusDaAlteracao);
router.delete("/:id", removerAlteracao);

export default router;
