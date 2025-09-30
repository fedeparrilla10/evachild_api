import express, { Router } from "express";
import * as roleController from "../controllers/roleController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, roleController.getAllRoles);
router.get("/:id", authMiddleware, roleController.getRoleById);
router.post("/", authMiddleware, roleController.createRole);
router.put("/:id", authMiddleware, roleController.updateRole);
router.delete("/:id", authMiddleware, roleController.deleteRole);

export default router;
