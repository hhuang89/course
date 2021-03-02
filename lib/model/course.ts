export interface GetCourseByIdResponse {
  data: Course;
  code: number;
  msg: string;
}

export interface Course {
  createdAt: string;
  updatedAt: string;
  id: number;
  cover: string;
  detail: string;
  duration: number;
  durationUnit: number;
  maxStudents: number;
  name: string;
  price: number;
  uid: string;
  star: number;
  startTime: string;
  status: number;
  scheduleId: number;
  teacherId: number;
  teacher: Teacher;
  schedule: Schedule;
  type: CourseType[];
  sales: Sales;
  teacherName: string;
}

export interface Sales {
  createdAt: string;
  updatedAt: string;
  id: number;
  batches: number;
  price: number;
  earnings: number;
  paidAmount: number;
  studentAmount: number;
  paidIds: number[];
}

export interface CourseType {
  id: number;
  name: string;
}

export interface Schedule {
  createdAt: string;
  updatedAt: string;
  id: number;
  status: number;
  current: number;
  classTime: string[];
  chapters: Chapter[];
}

export interface Chapter {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  order: number;
  content: string;
}

export interface Teacher {
  createdAt: string;
  updatedAt: string;
  id: number;
  country: string;
  courseAmount: number;
  email: string;
  name: string;
  phone: string;
  profileId: number;
}