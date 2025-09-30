import * as classService from "../services/classService.ts";
import { type Request, type Response } from "express";

const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await classService.getAllClasses();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getClassById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const classRoom = await classService.getClassById(id);
    if (!classRoom) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classRoom);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createClass = async (req: Request, res: Response) => {
  try {
    const classRoom = await classService.createClass(req.body);
    res.status(201).json(classRoom);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateClass = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const classRoom = await classService.updateClass(id, req.body);
    res.json(classRoom);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteClass = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await classService.deleteClass(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllClasses, createClass, getClassById, updateClass, deleteClass };
