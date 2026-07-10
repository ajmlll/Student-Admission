export interface StudentInput {
  studentName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  previousSchool?: string;
  applyingGrade: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4';
}

export interface Student extends StudentInput {
  id: string;
  parentId: string;
  status:
    | 'APPLICATION_CREATED'
    | 'REGISTRATION_FEE_PAID'
    | 'SLOT_BOOKED'
    | 'EXAM_COMPLETED'
    | 'ADMISSION_COMPLETED';
  registrationFee: {
    paid: boolean;
    paidAt?: string;
  };
  examSlot?: {
    slotId?: string;
    bookedAt?: string;
  };
  examScore?: number;
  assignedCourse?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchStudents(): Promise<Student[]> {
  const res = await fetch('/api/proxy/students');
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to fetch students');
  }
  return res.json();
}

export async function fetchStudentById(id: string): Promise<Student> {
  const res = await fetch(`/api/proxy/students/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to fetch student details');
  }
  return res.json();
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const res = await fetch('/api/proxy/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to create student application');
  }
  return res.json();
}

export async function updateStudent(
  id: string,
  input: Partial<StudentInput>,
): Promise<Student> {
  const res = await fetch(`/api/proxy/students/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to update student application');
  }
  return res.json();
}

export async function payRegistrationFee(id: string): Promise<Student> {
  const res = await fetch(`/api/proxy/students/${id}/pay-fee`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message?.[0] || err.message || 'Failed to process registration fee payment');
  }
  return res.json();
}
