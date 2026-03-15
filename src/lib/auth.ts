import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/drizzle";

declare module "next-auth" {
  interface Session {
    user: {
      google_mail: string;
      _permissions: {
        isAuthorized: boolean;
      };
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Google],
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          google_mail: user.email,
          _permissions: {
            isAuthorized: true,
          },
        },
      };
    },
  },
});
