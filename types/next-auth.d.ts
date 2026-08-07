import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    sessionIssuedAt?: number;
    user: {
      id: string;
      username: string;
      coverImage: string | null;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    iat?: number;
  }
}
