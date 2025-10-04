import express, { Router } from "express";
import * as categoryController from "../controllers/categoryController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, categoryController.getAllCategories);
router.get("/:id", authMiddleware, categoryController.getCategoryById);
router.post("/", authMiddleware, categoryController.createCategory);
router.put("/:id", authMiddleware, categoryController.updateCategory);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

export default router;
