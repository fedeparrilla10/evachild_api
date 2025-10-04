import express, { Router } from "express";
import * as milestoneController from "../controllers/milestoneController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, milestoneController.getAllMilestones);
router.get("/:id", authMiddleware, milestoneController.getMilestoneById);
router.post("/", authMiddleware, milestoneController.createMilestone);
router.put("/:id", authMiddleware, milestoneController.updateMilestone);
router.delete("/:id", authMiddleware, milestoneController.deleteMilestone);

export default router;
