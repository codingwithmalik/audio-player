import UserProfile from "@/schemas/UserProfile";

export async function generateUniqueUsername(email: string): Promise<string> {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  let candidate = base;
  let suffix = 0;

  // Loop until we find an unused username — rare beyond 1-2 tries in practice
  while (await UserProfile.exists({ username: candidate })) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}
