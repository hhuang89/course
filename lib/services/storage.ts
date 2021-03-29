import { useState } from "react";

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
  if (typeof localStorage !== "undefined") {
    return JSON.parse(localStorage?.getItem("auth")).role;
  }
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

// export function getUserInfo() {
//   if (typeof localStorage !== "undefined") {
//     return JSON.parse(localStorage?.getItem("auth"));
//   }
// }

// export function getUser() {
//   return getUserInfo()?.role;
// }
