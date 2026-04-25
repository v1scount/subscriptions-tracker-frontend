'use server'

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema } from "@/schemas";

import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signUpAction(prevState: any, formData: FormData) {
  const validatedFields = signUpSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { email, password, name } = validatedFields.data;
  const lang = formData.get('lang') as string || 'en';

  try {

    // 1. Create the user in the backend
    await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ user: { email, password, name } }),
    });

    // 2. Sign in the user automatically
    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${lang}/dashboard`,
    });
  } catch (error: any) {
    // Auth.js signIn() redirects by throwing a special error — rethrow it
    if (isRedirectError(error)) throw error;
    if (error.type === 'CredentialsSignin') {
      return { error: 'Invalid credentials.' };
    }
    return { error: error.message || "Something went wrong" };
  }
}

export async function signInAction(prevState: any, formData: FormData) {
  const validatedFields = signInSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { email, password } = validatedFields.data;
  const lang = formData.get('lang') as string || 'en';

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: `/${lang}/dashboard`,
    });
  } catch (error: any) {
    // Auth.js signIn() redirects by throwing a special error — rethrow it
    if (isRedirectError(error)) throw error;
    if (error.type === 'CredentialsSignin') {
      return { error: 'Invalid credentials.' };
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
