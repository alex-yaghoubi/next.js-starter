import { handlers } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Auth.js v5 exports individual route functions, not the handlers object itself.
export const { GET, POST } = handlers;
