import * as milestoneService from "../services/milestoneService.ts";
import { type Request, type Response } from "express";

const getAllMilestones = async (req: Request, res: Response) => {
  try {
    const milestones = await milestoneService.getAllMilestones();
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMilestoneById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const milestone = await milestoneService.getMilestoneById(id);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createMilestone = async (req: Request, res: Response) => {
  try {
    const milestone = await milestoneService.createMilestone(req.body);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMilestone = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const milestone = await milestoneService.updateMilestone(id, req.body);
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMilestone = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await milestoneService.deleteMilestone(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllMilestones,
  createMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};
