import express, { Router } from "express";
import * as evaluationController from "../controllers/evaluationController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, evaluationController.getAllEvaluations);
router.get("/:id", authMiddleware, evaluationController.getEvaluationById);
router.post("/", authMiddleware, evaluationController.createEvaluation);
router.put("/:id", authMiddleware, evaluationController.updateEvaluation);
router.delete("/:id", authMiddleware, evaluationController.deleteEvaluation);

export default router;
