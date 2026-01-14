// src/utils/api.js
const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

export const request = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    // 토큰이 있으면 Authorization 헤더 자동 추가
    if (token) {
        defaultHeaders["Authorization"] = `JWT ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        // 204 No Content 같은 경우 처리 (데이터가 없는 응답 대비)
        const data = response.status === 204 ? {} : await response.json();

        if (!response.ok) {
            // Error 객체를 생성하고 그 안에 서버 응답 데이터(data)를 저장합니다.
            const error = new Error("API_ERROR");
            error.status = response.status;
            error.data = data; // { username: [...], error: "..." } 등 모든 형태가 여기 담김
            throw error;
        }

        return data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};
