import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.ts";
import roleRoutes from "./routes/roleRoutes.ts";
import classRoutes from "./routes/classRoutes.ts";
import childRoutes from "./routes/childRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
import milestoneRoutes from "./routes/milestoneRoutes.ts";
import evaluationRoutes from "./routes/evaluationRoutes.ts";
import categoryRoutes from "./routes/categoryRoutes.ts";

dotenv.config();

const app: express.Application = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/children", childRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/categories", categoryRoutes);

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on <http://localhost:${PORT}> 🚀`);
  });
}

export default app;
