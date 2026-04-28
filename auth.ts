import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { apiFetch } from "@/lib/api";

declare module "next-auth" {
  interface User {
    role?: "user" | "admin";
    accessToken?: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call the NestJS backend
          const result = await apiFetch<{ access_token: string; user: { id: string; email: string; name: string; role: "user" | "admin" } }>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (result && result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              role: result.user.role,
              accessToken: result.access_token,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken as string | undefined;
        token.role = user.role;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string | undefined;
        session.user = token.user as any;
      }
      return session;
    },
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "admin";
      const isAdminRoute = nextUrl.pathname.startsWith("/dashboard/admin");

      if (isAdminRoute && !isAdmin) {
        return false;
      }

      return true;
    },
  },
})