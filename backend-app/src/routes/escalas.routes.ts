import { Router } from "express";
import {
  atualizarEscala,
  configurarEscalasPorPosto,
  listarEscalasPorPosto,
  listarMembrosEscala,
} from "../controllers/escalas.controller.js";

const router = Router();

router.post("/configurar", configurarEscalasPorPosto);
router.get("/membros", listarMembrosEscala);
router.get("/:posto", listarEscalasPorPosto);
router.patch("/:id", atualizarEscala);

export default router;