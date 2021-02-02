import { message } from "antd";
import axios, { AxiosError } from "axios";

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

//Base Api Service
async function get(path, params) {
  return axiosInstance
    .get(path, {params: params})
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      message.error(err);
    });
}

function post(path, params) {
  return axiosInstance
    .post(path, params)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      message.error(err);
    });
}

//api service
export function getCountry(path, params) {
  const form_countries = [];
  get(path, params)
    .then((data) => {
      data.data.map((data) => {
        form_countries.push(data.en);
      });
      return form_countries;
    })
    .catch((err) => {
      message.error(err);
    });

    return [];
}

//export async function getStudent (path, params) {
export function getStudent (path, params) {
  const table_countries = [];
  get(path, params)
  .then((res) => {
    const {
      data: { students, total },
    } = res;
    
    students.forEach((student) => {
      table_countries.push({
        text: student.country,
        value: student.country,
      });
    });

    return total;
    //return [students, total, table_countries]
  })
  .catch(() => {
    message.error("error");
  });
}