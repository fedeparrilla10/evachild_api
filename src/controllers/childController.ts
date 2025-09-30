import * as childService from "../services/childService.ts";
import { type Request, type Response } from "express";

const getAllChildren = async (req: Request, res: Response) => {
  try {
    const children = await childService.getAllChildren();
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getChildById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const child = await childService.getChildById(id);
    if (!child) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.json(child);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createChild = async (req: Request, res: Response) => {
  try {
    const child = await childService.createChild(req.body);
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateChild = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const child = await childService.updateChild(id, req.body);
    res.json(child);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteChild = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await childService.deleteChild(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllChildren, createChild, getChildById, updateChild, deleteChild };
