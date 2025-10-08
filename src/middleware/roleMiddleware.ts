import { type Request, type Response, type NextFunction } from "express";
import { canUser } from "../utils/permissions.js";

export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoleName = req.user?.roleName;

    if (!userRoleName) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!canUser(userRoleName, resource, action)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
