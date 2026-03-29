import { Router } from "express";
import { criarServico } from "../controllers/servicos.controller.js";

const router = Router()

router.post('/', criarServico)

export default router