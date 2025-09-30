import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Class = {
  name: string;
  min_age: number;
  max_age: number;
};

const getAllClasses = async () => {
  return await prisma.class.findMany();
};

const getClassById = async (id: number) => {
  return await prisma.class.findUnique({ where: { id: id } });
};

const createClass = async (data: Class) => {
  return await prisma.class.create({ data });
};

const updateClass = async (id: number, data: Class) => {
  return await prisma.class.update({ where: { id: id }, data });
};

const deleteClass = async (id: number) => {
  return await prisma.class.delete({ where: { id: id } });
};

export { getAllClasses, createClass, getClassById, updateClass, deleteClass };
