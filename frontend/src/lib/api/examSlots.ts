export interface ExamSlot {
  id: string;
  date: string;
  time: string;
  capacity: number;
  isBooked: boolean;
  bookedStudentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export async function fetchExamSlots(showAll?: boolean): Promise<ExamSlot[]> {
  const query = showAll ? '?all=true' : '';
  const res = await fetch(`/api/proxy/exam-slots${query}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to fetch exam slots');
  }
  return res.json();
}

export async function bookExamSlot(
  slotId: string,
  studentId: string,
): Promise<ExamSlot> {
  const res = await fetch(`/api/proxy/exam-slots/${slotId}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to book exam slot');
  }
  return res.json();
}

export async function createExamSlot(input: {
  date: string;
  time: string;
  capacity?: number;
}): Promise<ExamSlot> {
  const res = await fetch('/api/proxy/exam-slots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to create exam slot');
  }
  return res.json();
}

export async function deleteExamSlot(id: string): Promise<void> {
  const res = await fetch(`/api/proxy/exam-slots/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to delete exam slot');
  }
}

export async function updateExamSlot(
  id: string,
  input: { date: string; time: string; capacity: number },
): Promise<ExamSlot> {
  const res = await fetch(`/api/proxy/exam-slots/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to update exam slot');
  }
  return res.json();
}
