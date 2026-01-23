export type Role = "submitter" | "reviewer";

export function login(role: Role) {
  document.cookie = `auth=${JSON.stringify({
    role,
    loggedIn: true,
  })}; path=/`;
}

export function logout() {
  document.cookie = "auth=; Max-Age=0; path=/";
}

export function getAuthFromCookie() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/auth=([^;]+)/);
  return match ? JSON.parse(decodeURIComponent(match[1])) : null;
}

/* This will later be replaced with JWT cookies. For now, it lets us build everything. */