import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type User = {
  role_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users.map(({ password, ...user }) => user);
};

const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const createUser = async (data: User) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const updateUser = async (id: number, data: User) => {
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
  }
  const user = await prisma.user.update({ where: { id: id }, data });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const deleteUser = async (id: number) => {
  return await prisma.user.delete({ where: { id: id } });
};

export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
