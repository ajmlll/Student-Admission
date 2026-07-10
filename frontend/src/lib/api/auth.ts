const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message?.[0] || errorData.message || 'Login failed',
    );
  }

  const data = await res.json(); // Expected: { accessToken, user }

  // Establish httpOnly session cookie in Next.js
  const cookieRes = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: data.accessToken, user: data.user }),
  });

  if (!cookieRes.ok) {
    throw new Error('Failed to establish session cookie');
  }

  return data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: 'parent' }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message?.[0] || errorData.message || 'Registration failed',
    );
  }

  return res.json();
}

export async function logoutApi() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to clear session cookie');
  }

  return res.json();
}
