import { db, mongoClient } from "@/db/client";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  plugins: [
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every day the session will be updated)
  },
  advanced: {
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: process.env.ENABLE_SSO === 'true',
      domain: process.env.AUTH_COOKIE_DOMAIN,
    },
  },
  trustedOrigins: process.env.ENABLE_SSO === 'true' ? [
    process.env.BETTER_AUTH_URL!,
    ...(process.env.TRUSTED_ORIGINS?.split(',') || [])
  ] : [process.env.BETTER_AUTH_URL!],
})

export type Session = typeof auth.$Infer.Session