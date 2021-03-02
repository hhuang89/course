export interface OverviewResponse {
  course: Basic;
  student: Student;
  teacher: Teacher;
}

export interface Teacher extends Basic {
  gender: { unknown: number; male: number; female: number };
}

export interface Student extends Basic {
  gender: { male: number; female: number };
}

export interface Basic {
  lastMonthAdded: number;
  total: number;
}
