import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Milestone = {
  name: string;
  description: string;
  min_age: number;
  max_age: number;
  category_id: number;
};

const getAllMilestones = async () => {
  return await prisma.milestone.findMany({
    include: {
      category: true,
    },
  });
};

const getMilestoneById = async (id: number) => {
  return await prisma.milestone.findUnique({
    where: { id: id },
    include: {
      category: true,
    },
  });
};

const createMilestone = async (data: Milestone) => {
  return await prisma.milestone.create({ data });
};

const updateMilestone = async (id: number, data: Milestone) => {
  return await prisma.milestone.update({ where: { id: id }, data });
};

const deleteMilestone = async (id: number) => {
  return await prisma.milestone.delete({ where: { id: id } });
};

export {
  getAllMilestones,
  createMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};
