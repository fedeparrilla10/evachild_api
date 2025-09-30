import express, { Router } from "express";
import * as childController from "../controllers/childController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: Router = express.Router();

router.get("/", authMiddleware, childController.getAllChildren);
router.get("/:id", authMiddleware, childController.getChildById);
router.post("/", authMiddleware, childController.createChild);
router.put("/:id", authMiddleware, childController.updateChild);
router.delete("/:id", authMiddleware, childController.deleteChild);

export default router;
