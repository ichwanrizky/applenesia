import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  secret: process.env.JWT,
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const body = JSON.stringify({
          username,
          password,
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            body,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const res = await response.json();

          if (res.status) {
            return res.data;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, profile, account, user }: any) {
      if (account?.provider == "credentials") {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.role_id = user.role.id;
        token.role_name = user.role.name;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      delete session.user.email;
      delete session.user.image;

      if ("id" in token) {
        session.user.id = token.id;
      }
      if ("username" in token) {
        session.user.username = token.username;
      }
      if ("name" in token) {
        session.user.name = token.name;
      }

      if ("role_id" in token) {
        session.user.role_id = token.role_id;
      }
      if ("role_name" in token) {
        session.user.role_name = token.role_name;
      }
      if ("accessToken" in token) {
        session.user.accessToken = token.accessToken;
      }
      if ("refreshToken" in token) {
        session.user.refreshToken = token.refreshToken;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
