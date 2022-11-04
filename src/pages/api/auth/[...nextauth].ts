import * as argon2 from "argon2";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token, user }) {
      if (token.user) {
        // @ts-ignore
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials === undefined) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: {
            username: credentials.username,
          },
        });
        if (user && user.password) {
          const passwordValid = await argon2.verify(
            user.password,
            credentials.password
          );
          if (passwordValid) {
            const userData = {
              id: user.id,
              username: user.username,
              role: user.role,
            };
            return userData;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
