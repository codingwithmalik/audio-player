import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongoClient";
import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";
import { generateUniqueUsername } from "@/utils/generateUsername";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await UserProfile.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  session: {
    strategy: "jwt", // required — Credentials provider cannot use database sessions
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.id) return false;

      // Credentials users are already resolved by authorize() above — this
      // only runs the "first-time" creation path for Google/Apple/Email.
      await connectDB();
      
      const existing = await UserProfile.findById(user.id);

      if (!existing) {
        if (!user.email) return false; // shouldn't happen, but guards the username generator
        const username = await generateUniqueUsername(user.email);
        await UserProfile.create({
          _id: user.id,
          username,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        await connectDB();
        const profile = await UserProfile.findById(token.id as string);

        session.user.id = token.id as string;
        session.user.username = profile?.username ?? "";
        session.user.coverImage =
          profile?.coverImage || session.user.image || null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
