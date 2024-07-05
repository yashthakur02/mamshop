import type { NextAuthConfig } from "next-auth";
import { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // async authorize(): Promise<User | null> {

      // }
    })
  ],
  // secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth"
  }
} satisfies NextAuthConfig;