import { Student } from './students';

export async function fetchAdmissionApplications(
  status?: string,
): Promise<Student[]> {
  const query = status ? `?status=${status}` : '';
  const res = await fetch(`/api/proxy/admission/applications${query}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.message?.[0] || err.message || 'Failed to fetch applications',
    );
  }
  return res.json();
}

export async function submitExamScore(
  studentId: string,
  score: number,
): Promise<Student> {
  const res = await fetch(`/api/proxy/admission/${studentId}/exam-score`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.message?.[0] || err.message || 'Failed to submit exam score',
    );
  }
  return res.json();
}

export async function assignCourse(
  studentId: string,
  course: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4',
): Promise<Student> {
  const res = await fetch(`/api/proxy/admission/${studentId}/assign-course`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.message?.[0] || err.message || 'Failed to assign course',
    );
  }
  return res.json();
}

export async function fetchCompletedAdmissions(): Promise<Student[]> {
  const res = await fetch('/api/proxy/admission/completed');
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.message?.[0] ||
        err.message ||
        'Failed to fetch completed admissions list',
    );
  }
  return res.json();
}
