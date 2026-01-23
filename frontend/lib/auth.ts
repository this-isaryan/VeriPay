export type Role = "submitter" | "reviewer";

export function getAuth() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth");
  return raw ? JSON.parse(raw) : null;
}

export function login(role: Role) {
  localStorage.setItem(
    "auth",
    JSON.stringify({ role, loggedIn: true })
  );
}

export function logout() {
  localStorage.removeItem("auth");
}

/* This will later be replaced with JWT cookies. For now, it lets us build everything. */