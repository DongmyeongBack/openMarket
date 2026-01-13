// src/utils/api.js

const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

export const request = async (url, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const data = await response.json(); // 응답 데이터를 먼저 변수에 담습니다.

        if (!response.ok) {
            // 서버가 보내주는 실제 에러 내용을 확인하기 위해 data 전체를 활용합니다.
            // 보통 { "FAIL_Message": "..." } 또는 { "error": "..." } 형태로 옵니다.
            const errorMessage = data.FAIL_Message || data.error || data.message || "API 요청 실패";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
