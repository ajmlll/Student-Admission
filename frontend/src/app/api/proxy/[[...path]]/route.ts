import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function handleProxy(
  request: Request,
  props: { params: Promise<{ path?: string[] }> },
) {
  const { path: pathSegments } = await props.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const path = pathSegments?.join('/') || '';
  const searchParams = new URL(request.url).searchParams.toString();

  const targetUrl = `${BACKEND_URL}/${path}${
    searchParams ? `?${searchParams}` : ''
  }`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const method = request.method;
  let body: string | undefined = undefined;

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.text();
    } catch (e) {
      body = undefined;
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const contentType = res.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { text: await res.text() };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { message: ['Proxy connection to backend failed'] },
      { status: 502 },
    );
  }
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE,
};
