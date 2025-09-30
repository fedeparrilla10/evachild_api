import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Child = {
  name: string;
  age: number;
  class_id: number;
};

const getAllChildren = async () => {
  return await prisma.child.findMany();
};

const getChildById = async (id: number) => {
  return await prisma.child.findUnique({ where: { id: id } });
};

const createChild = async (data: Child) => {
  return await prisma.child.create({ data });
};

const updateChild = async (id: number, data: Child) => {
  return await prisma.child.update({ where: { id: id }, data });
};

const deleteChild = async (id: number) => {
  return await prisma.child.delete({ where: { id: id } });
};

export { getAllChildren, createChild, getChildById, updateChild, deleteChild };
