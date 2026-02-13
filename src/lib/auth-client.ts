import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  plugins: [
    inferAdditionalFields({
      user: {
        department: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});

export const authClient = client;

// Definisikan interface User yang diperluas
export interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  department?: string | null;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Wrapper untuk useSession agar memiliki tipe yang benar
export const useSession = () => {
  const session = client.useSession();
  return {
    ...session,
    data: session.data ? {
      ...session.data,
      user: session.data.user as ExtendedUser
    } : null
  } as typeof session & { data: { user: ExtendedUser } | null };
};

export const signIn = client.signIn;
export const signOut = client.signOut;
export const signUp = client.signUp;

export default client;