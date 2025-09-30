import * as authService from "../services/authService.ts";
import { type Request, type Response } from "express";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { login };
