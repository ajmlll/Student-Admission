export interface ExamSlot {
  id: string;
  date: string;
  time: string;
  capacity: number;
  isBooked: boolean;
  bookedByStudentId?: string | null;
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
