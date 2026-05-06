import { Router } from "express";
import { criarAviso, listarAvisos } from "../controllers/avisos.controller.js";

const router = Router();

router.post("/", criarAviso);
router.get("/", listarAvisos);

export default router;
