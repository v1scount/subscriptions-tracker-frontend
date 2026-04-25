import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { apiFetch } from "@/lib/api";
 
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
          const result = await apiFetch<{ access_token: string; user: any }>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (result && result.user) {
            return {
              ...result.user,
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
        token.accessToken = (user as any).accessToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).user = token.user;
      }
      return session;
    },
    authorized() {
      return true;
    },
  },
})