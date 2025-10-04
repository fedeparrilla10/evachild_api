import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Category = {
  name: string;
  description: string;
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      milestones: true,
    },
  });
};

const getCategoryById = async (id: number) => {
  return await prisma.category.findUnique({
    where: { id: id },
    include: {
      milestones: true,
    },
  });
};

const createCategory = async (data: Category) => {
  return await prisma.category.create({ data });
};

const updateCategory = async (id: number, data: Category) => {
  return await prisma.category.update({ where: { id: id }, data });
};

const deleteCategory = async (id: number) => {
  return await prisma.category.delete({ where: { id: id } });
};

export {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
