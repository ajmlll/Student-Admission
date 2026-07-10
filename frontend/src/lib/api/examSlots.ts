const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchExamSlots() {
  console.log('fetchExamSlots placeholder called from API layer');
  return [];
}
