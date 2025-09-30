import express, { Router } from "express";
import * as classController from "../controllers/classController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, classController.getAllClasses);
router.get("/:id", authMiddleware, classController.getClassById);
router.post("/", authMiddleware, classController.createClass);
router.put("/:id", authMiddleware, classController.updateClass);
router.delete("/:id", authMiddleware, classController.deleteClass);

export default router;
