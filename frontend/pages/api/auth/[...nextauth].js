import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      return profile.email.endsWith("@ucsc.edu");
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          console.log("[NextAuth] Fetching Django token for:", profile.email);
          const res = await fetch(`${DJANGO_API_URL}/auth/google-token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: profile.email }),
          });
          console.log("[NextAuth] Django response status:", res.status);
          if (res.ok) {
            const data = await res.json();
            token.djangoAccessToken = data.access;
            console.log("[NextAuth] Django token stored successfully");
          } else {
            const text = await res.text();
            console.log("[NextAuth] Django error response:", text);
          }
        } catch (e) {
          console.log("[NextAuth] Django fetch failed:", e.message);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.djangoAccessToken = token.djangoAccessToken;
      return session;
    },
  },

  pages: {
    signIn: "/OAuthlogin",
    error: "/OAuthlogin",
  },
});
