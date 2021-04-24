import { message } from "antd";
import axios, { AxiosError } from "axios";
import { AES } from "crypto-js";
import { MessageStatistics } from "../model/message";
import { getUserId } from "./storage";
import { IResponse } from "../model";
import { SearchTeacherResponse, TeacherRequest } from "../model";

export const baseURL = "https://cms.chtoma.com/api/";
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL,
  responseType: "json",
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes("login")) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).token}`,
      },
    };
  }
  return config;
});

function errorHandler(err: AxiosError<IResponse>): IResponse {
  const msg = err.response.data.msg;
  const code = err.response.status;

  return {msg, code};
}

//Base Api Service
async function get(path, params:any = "") {
  return axiosInstance
    .get(path, { params: params})
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return　new Promise((_, reject) => {
        reject(err.data)
      })
    });
}

function post(path, body) {
  return axiosInstance
    .post(path, body)
    .then((response) => {
      return new Promise((resolve) => {
        resolve(response.data);
      });
    })
    .catch((err) => {
      errorHandler(err);
    });
}

function put<T>(path: string, body: object): Promise<any> {
  return axiosInstance
  .put(path, body)
  .then((response) => {
    return response.data;
  })
  .catch((err) => {
    return new Promise((_, reject) => {
      reject(err.response.data);
      
    })
  })
}

function baseapi_delete(path) {
  return axiosInstance.delete(path).then((response) => {
    return new Promise((resolve) => {
      resolve(response.data);
    })
    .catch((err) => {
      return　new Promise((_, reject) => {
        reject(err.response.data)
      })
    })
  })
}

//api service
//message
export function getMessageStatistics(params="") {
  return get("/message/statistics", params);
}

export function getMessage(params) {
  return get("/message", params);
}

export function markAsRead(ids: number[]): Promise<IResponse<boolean>> {
  return put("/message", {ids: ids, status: 1});
}

//overview
export function getOverview(params) {
  return get("/statistics/overview", params);
}

export function getStatisticsStudent(params) {
  return get("/statistics/student", params);
}

export function getStatisticsTeacher(params) {
  return get("/statistics/teacher", params);
}

export function getStatisticsCourse(params) {
  return get("/statistics/course", params);
}

//student
export function getCountry(params) {
  return get("/countries", params);
}

export function getStudent(params) {
  return get("/students", params);
}

export function searchStudent(params) {
  return get("/students", params);
}

export function getStudentById(params) {
  return get(`/students/${params}`, params);
}

export function postAddStudent(body) {
  return post("/students", {
    name: body.name,
    country: body.area,
    email: body.email,
    type: body.type,
  });
}

export function updateStudent (body) {
  return put("/students", {
    id: body.id,
    name: body.name,
    country: body.area,
    email: body.email,
    type: body.type,
  })
}

export function deleteStudent(id) {
  return baseapi_delete(`/students/${id}`)
}

//course
export function getCourses(params) {
  return get("/courses", params);
}

export function getCourseById(params) {
  return get(`/courses/detail`, params);
}

export function getCourseCode(): Promise<IResponse> {
  return get('/courses/code');
}

export function getType(): Promise<IResponse> {
  return get('/courses/type');
}

//login
export function postLoginForm(body) {
  return post("/login", {
    email: body.username,
    password: AES.encrypt(body.password, "cms").toString(),
    role: body.role,
  });
}

//teacher
export function searchTeacherByName(req: TeacherRequest): Promise<IResponse<SearchTeacherResponse>> {
  return get('/teachers', req);
}