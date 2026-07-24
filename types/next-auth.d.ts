import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    sessionIssuedAt?: number;
    user: {
      id: string;
      username: string;
      coverImage: string | null;
    } & DefaultSession["user"];
  }
}
