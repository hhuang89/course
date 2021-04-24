import { Paginator } from "./api";

export interface SearchTeacherResponse {
  total: number;
  teachers: Teacher[];
  paginator: Paginator;
}

export interface TeacherRequest {
  query?: string;
  page?: number; //start from 1
  limit?: number;
}

export interface Teacher {
  createdAt: string;
  updatedAt: string;
  id: number; //uid
  country: string;
  courseAmount: number;
  email: string;
  name: string;
  phone: string;
  profileId: number;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number;
}
