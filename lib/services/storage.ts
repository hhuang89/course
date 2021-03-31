import { useRouter } from "next/router";

export function getToken() {
  if (typeof localStorage !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("auth")).token;
    } catch {
      null;
    }
  }
}

export function getUserRole() {
    const router = useRouter();
    return router.pathname.split('/')[2];
}

export function getUserId() {
  if (typeof localStorage !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("auth")).userId;
    } catch {
      null;
    }
  }
}
