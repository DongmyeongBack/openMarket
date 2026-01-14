// src/utils/api.js
const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

export const request = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    // 수정된 부분: body가 FormData라면 Content-Type 헤더를 설정하지 않음 (브라우저가 자동 설정)
    const headers = {
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: headers,
        });

        // (이하 코드는 동일합니다)
        const data = response.status === 204 ? {} : await response.json();

        if (!response.ok) {
            const error = new Error("API_ERROR");
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};
