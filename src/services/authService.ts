import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

type LoginData = {
  email: string;
  password: string;
};

export type JwtPayload = {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";

const loginUser = async (data: LoginData) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { role: true },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role.name,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export { loginUser, verifyToken };
