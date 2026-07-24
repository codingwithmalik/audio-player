const KEY = "audious_pending_password";

export function storePendingPassword(email: string, password: string) {
  sessionStorage.setItem(KEY, JSON.stringify({ email, password }));
}

export function consumePendingPassword(email: string): string | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;

  sessionStorage.removeItem(KEY); // always clear on read — one attempt only

  try {
    const { email: storedEmail, password } = JSON.parse(raw);
    return storedEmail === email ? password : null;
  } catch {
    return null;
  }
}
