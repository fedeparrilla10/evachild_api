import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.ts";
import roleRoutes from "./routes/roleRoutes.ts";
import classRoutes from "./routes/classRoutes.ts";
import childRoutes from "./routes/childRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/children", childRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on <http://localhost:${PORT}> 🚀`);
});
