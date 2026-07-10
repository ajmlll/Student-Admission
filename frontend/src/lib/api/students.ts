const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchStudents() {
  console.log('fetchStudents placeholder called from API layer');
  return [];
}
