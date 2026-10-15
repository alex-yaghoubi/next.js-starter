import type { DefaultSession } from "next-auth";

// Types for the sample credentials provider and JWT callbacks.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phoneNumber?: string;
      token?: string;
    } & DefaultSession["user"];
  }

  interface User {
    phoneNumber?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phoneNumber?: string;
    token?: string;
  }
}
