"use client"

import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include" // 确保跨域请求携带认证信息（cookies）
  }
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;