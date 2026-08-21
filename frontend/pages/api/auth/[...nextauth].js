import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          hd: "ucsc.edu",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      return profile.email.endsWith("@ucsc.edu");
    },

    async jwt({ token, account, profile }) {
      // On first login, fetch Django tokens and store with expiry
      if (account && profile) {
        try {
          const res = await fetch(`${DJANGO_API_URL}/auth/google-token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: profile.email }),
          });
          if (res.ok) {
            const data = await res.json();
            token.djangoAccessToken = data.access;
            token.djangoRefreshToken = data.refresh;
            // Store expiry 55 min from now (before the 1hr Django expiry)
            token.djangoAccessTokenExpiry = Date.now() + 55 * 60 * 1000;
          }
        } catch (e) {
          console.log("[NextAuth] Django fetch failed:", e.message);
        }
      }

      // Access token still valid, or no refresh token available (old session) — return as-is
      if (Date.now() < token.djangoAccessTokenExpiry || !token.djangoRefreshToken) {
        return token;
      }

      // Access token expired — use refresh token to get a new one
      try {
        const res = await fetch(`${DJANGO_API_URL}/auth/jwt/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: token.djangoRefreshToken }),
        });
        if (res.ok) {
          const data = await res.json();
          token.djangoAccessToken = data.access;
          token.djangoAccessTokenExpiry = Date.now() + 55 * 60 * 1000;
        } else {
          // Refresh token also expired — force re-login
          token.djangoAccessToken = null;
          token.djangoRefreshToken = null;
        }
      } catch (e) {
        console.log("[NextAuth] Token refresh failed:", e.message);
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
