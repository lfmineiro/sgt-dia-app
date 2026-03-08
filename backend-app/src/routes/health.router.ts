import { Router } from "express";
import { getHealthCheck, getStatus } from "../controllers/health.controller.js";

const router = Router();

router.get('/healthcheck', getHealthCheck)
router.get('/status', getStatus)


export default router;