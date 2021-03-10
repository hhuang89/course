export function getToken() {
    try {
        return JSON.parse(localStorage.getItem("auth")).token;
    } catch {
        null;
    }
    
}

export function getUserRole() {
    try {
        return JSON.parse(localStorage.getItem("auth")).role;
    } catch {
        null;
    }
}

export function getUserId() {
    try {
        return JSON.parse(localStorage.getItem("auth")).userId;
    } catch {
        null;
    }
}