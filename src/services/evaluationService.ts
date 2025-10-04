import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Evaluation = {
  child_id: number;
  score: number;
  comments?: string;
};

const getAllEvaluations = async () => {
  return await prisma.evaluation.findMany({
    include: {
      child: true,
    },
  });
};

const getEvaluationById = async (id: number) => {
  return await prisma.evaluation.findUnique({
    where: { id: id },
    include: {
      child: true,
    },
  });
};

const createEvaluation = async (data: Evaluation) => {
  return await prisma.evaluation.create({ data });
};

const updateEvaluation = async (id: number, data: Evaluation) => {
  return await prisma.evaluation.update({ where: { id: id }, data });
};

const deleteEvaluation = async (id: number) => {
  return await prisma.evaluation.delete({ where: { id: id } });
};

export {
  getAllEvaluations,
  createEvaluation,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
};
