
export type Role = "OWNER" | "DEVELOPER" | "ADMIN" | "CUSTOMER" | "MEMBER";

export function canUseUnlimitedAI(role: Role) {
  return role === "OWNER" || role === "DEVELOPER" || role === "ADMIN";
}

export function isStaff(role: Role) {
  return role === "OWNER" || role === "DEVELOPER" || role === "ADMIN";
}
