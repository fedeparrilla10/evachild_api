import express, { Router } from "express";
import * as authController from "../controllers/authController.ts";

const router: Router = express.Router();

router.post("/login", authController.login);

export default router;
