import * as evaluationService from "../services/evaluationService.ts";
import { type Request, type Response } from "express";

const getAllEvaluations = async (req: Request, res: Response) => {
  try {
    const evaluations = await evaluationService.getAllEvaluations();
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEvaluationById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const evaluation = await evaluationService.getEvaluationById(id);
    if (!evaluation) {
      return res.status(404).json({ error: "Evaluation not found" });
    }
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createEvaluation = async (req: Request, res: Response) => {
  try {
    const evaluation = await evaluationService.createEvaluation(req.body);
    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEvaluation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const evaluation = await evaluationService.updateEvaluation(id, req.body);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteEvaluation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await evaluationService.deleteEvaluation(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllEvaluations,
  createEvaluation,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
};
