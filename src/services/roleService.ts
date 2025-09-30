import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Role = {
  name: string;
};

const getAllRoles = async () => {
  return await prisma.role.findMany();
};

const getRoleById = async (id: number) => {
  return await prisma.role.findUnique({ where: { id: id } });
};

const createRole = async (data: Role) => {
  return await prisma.role.create({ data });
};

const updateRole = async (id: number, data: Role) => {
  return await prisma.role.update({ where: { id: id }, data });
};

const deleteRole = async (id: number) => {
  return await prisma.role.delete({ where: { id: id } });
};

export { getAllRoles, createRole, getRoleById, updateRole, deleteRole };
