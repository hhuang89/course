import { message } from "antd";
import axios, { AxiosError } from "axios";
import { AES } from "crypto-js";
import { resolve } from "path";
import { version } from "process";

export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

const baseURL = "https://cms.chtoma.com/api/";
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
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
async function get(path, params) {
  return axiosInstance
    .get(path, { params: params })
    .then((response) => {
      return new Promise((resolve) => {
        resolve(response.data);
      });
    })
    .catch((err) => {
      return　new Promise((_, reject) => {
        reject(err.response.data)
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

function put(path, body) {
  return axiosInstance
  .put(path, body)
  .then((response) => {
    return new Promise((resolve) => {
      resolve(response.data);
    });
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
//get
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

//post
export function postLoginForm(body) {
  return post("/login", {
    email: body.username,
    password: AES.encrypt(body.password, "cms").toString(),
    role: body.role,
  });
}

export function postAddStudent(body) {
  return post("/students", {
    name: body.name,
    country: body.area,
    email: body.email,
    type: body.type,
  });
}

//put
export function updateStudent (body) {
  return put("/students", {
    id: body.id,
    name: body.name,
    country: body.area,
    email: body.email,
    type: body.type,
  })
}

//delete
export function deleteStudent(id) {
  return baseapi_delete(`/students/${id}`)
}