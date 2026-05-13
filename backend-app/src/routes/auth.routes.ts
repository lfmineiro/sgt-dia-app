import { Router } from "express";
import { realizarLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", realizarLogin);

export default router;