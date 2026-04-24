'use server'

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server Action for signing up a new user.
 * It connects to the NestJS backend and sets a session cookie upon success.
 */
export async function signUpAction(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');

  try {
    // 1. Call your NestJS backend
    const result = await apiFetch<{ access_token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    // 2. Set the JWT in an HTTP-only cookie
    // This is secure and can't be accessed by client-side JS
    (await cookies()).set('auth_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

  } catch (error: any) {
    return { error: error.message };
  }

  // 3. Redirect to dashboard or home upon success
  redirect('/dashboard');
}

/**
 * Server Action for signing in.
 */
export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const result = await apiFetch<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    (await cookies()).set('auth_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

  } catch (error: any) {
    return { error: error.message };
  }

  redirect('/dashboard');
}
