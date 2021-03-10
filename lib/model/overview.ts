export interface Basic {
  lastMonthAdded: number;
  total: number;
}

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

export interface StudentStatistics {
  country: Country[];
  type: Country[];
  courses: Country[];
  createdAt: any[];
  interest: Country[];
}

export interface Country {
  name: string;
  amount: number;
}

export type Statistic = { amount: number; name: string; [key: string]: any };

export interface TeacherStatistics {
  country: Country[];
  createdAt: Country[];
  skills: Skills;
  workExperience: string[];
}

export interface Skills {
  C: C[];
  Python: C[];
  'C++': C[];
  'C#': C[];
  'Visual Basic': C[];
  PHP: C[];
  R: C[];
  Groovy: C[];
  'Assembly Language': C[];
  SQL: C[];
  Swift: C[];
  Go: C[];
  Ruby: C[];
  Perl: C[];
  'Objective-C': C[];
  Julia: C[];
  Java: C[];
  JavaScript: C[];
  TypeScript: C[];
  null: C[];
  c: C[];
  ccc: C[];
  aaaa: C[];
  cc: C[];
}

export interface C {
  name: string;
  level: number;
  amount: number;
}

export interface CourseStatistics {
  type: Type[];
  createdAt: Type[];
  classTime: ClassTime[];
}

export interface ClassTime {
  name: string;
  amount: number;
  courses: Course[];
}

export interface Course {
  classTime?: (string[] | null)[];
  typeName: string;
  name: string;
}

export interface Type {
  name: string;
  amount: number;
}