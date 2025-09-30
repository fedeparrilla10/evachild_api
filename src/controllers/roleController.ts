import * as roleService from "../services/roleService.ts";
import { type Request, type Response } from "express";

const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRoleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const role = await roleService.getRoleById(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createRole = async (req: Request, res: Response) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const role = await roleService.updateRole(id, req.body);
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await roleService.deleteRole(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllRoles, createRole, getRoleById, updateRole, deleteRole };
