import * as categoryService from "../services/categoryService.ts";
import { type Request, type Response } from "express";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await categoryService.updateCategory(id, req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
