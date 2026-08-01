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
import { sendVerificationRequest } from "@/utils/email/sendVerificationRequest";
import { playlistService } from "@/services/playlistService";

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

        if (!user) return null;
        if (!user.password) throw new Error("NO_PASSWORD_SET");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        return { id: user._id.toString(), email: user.email };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
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
      sendVerificationRequest,
      maxAge: 24 * 60 * 60,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // Now just a simple approval gate — no DB writes, no id resolution here.
    // The adapter hasn't necessarily persisted anything for a brand-new
    // OAuth/Email user at the exact moment this runs, so nothing here
    // should depend on that data already existing.
    async signIn({ user }) {
      return !!user.email;
    },

    async jwt({ token, user }) {
      if (user) {
        // Always resolve the real id by looking up UserProfile via email —
        // never trust `user.id` directly, since for OAuth it may briefly be
        // the raw provider id (e.g. Google's `sub`) rather than our real _id.
        // By this point, `events.createUser` below has already run for any
        // brand-new OAuth/Email user, so a matching UserProfile is guaranteed
        // to exist already.
        await connectDB();
        const profile = await UserProfile.findOne({ email: user.email });
        token.id = profile ? profile._id : user.id;
        token.iat = Math.floor(Date.now() / 1000); // freshness marker, reset on every real login
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
        session.sessionIssuedAt = token.iat as number;
      }
      return session;
    },
  },

  // Fires exactly once, guaranteed AFTER the adapter has fully committed a
  // brand-new user document — this is the one moment `user.id` is 100%
  // reliable for OAuth/Email. Credentials never triggers this event at all,
  // since it bypasses the adapter entirely (that account is created directly
  // by the register flow instead, with its own already-correct id).
  events: {
    async createUser({ user }) {
      await connectDB();

      const existing = await UserProfile.findById(user.id);
      if (existing) return; // safety guard, shouldn't normally trigger

      const username = await generateUniqueUsername(user.email!);
      const profile = await UserProfile.create({
        _id: user.id,
        email: user.email,
        username,
      });
      await playlistService.ensureLikedPlaylist(profile._id);
    },
  },

  pages: {
    verifyRequest: "/verify-request",
    signIn: "/login",
    error: "/login", // OAuth errors land here instead of NextAuth's default page
  },
};
