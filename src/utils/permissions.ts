export const roles = {
  teacher: "Teacher",
  manager: "Manager",
  developer: "Developer",
} as const;

type RolePermissionsT = {
  children: string[];
  evaluations: string[];
  users: string[];
  classes: string[];
  categories: string[];
  milestones: string[];
};

const rolePermissions: Record<string, RolePermissionsT> = {
  Teacher: {
    children: ["view", "edit", "move"],
    evaluations: ["view", "create", "edit"],
    users: [],
    classes: ["view"],
    categories: ["view"],
    milestones: ["view"],
  },
  Manager: {
    children: ["view", "create", "edit", "delete", "move"],
    evaluations: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit"],
    classes: ["view", "create", "edit", "delete"],
    categories: ["view", "create", "edit", "delete"],
    milestones: ["view", "create", "edit", "delete"],
  },
  Developer: {
    children: ["view", "create", "edit", "delete", "move"],
    evaluations: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
    classes: ["view", "create", "edit", "delete"],
    categories: ["view", "create", "edit", "delete"],
    milestones: ["view", "create", "edit", "delete"],
  },
};

export const canUser = (
  roleName: string,
  resource: string,
  action: string
): boolean => {
  return (
    rolePermissions[roleName]?.[resource as keyof RolePermissionsT]?.includes(
      action
    ) || false
  );
};

export const getRolePermissions = (roleName: string): RolePermissionsT | {} => {
  return rolePermissions[roleName] || {};
};
