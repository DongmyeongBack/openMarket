// src/utils/api.js
const BASE_URL = "https://api.wenivops.co.kr/services/open-market";

export async function request(url, options = {}) {
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
        let response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: headers,
        });

        // [추가] 401 Unauthorized 발생 시 리프레시 토큰으로 재발급 시도
        if (response.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");

            // 리프레시 토큰이 있고, 현재 요청이 리프레시 요청이 아닌 경우에만 시도
            if (refreshToken && !url.includes("/accounts/token/refresh/")) {
                try {
                    console.log("🔄 토큰 만료. 리프레시 토큰으로 재발급 시도...");
                    const refreshRes = await fetch(`${BASE_URL}/accounts/token/refresh/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refresh: refreshToken }),
                    });

                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        const newAccessToken = refreshData.access;

                        console.log("✅ 토큰 재발급 성공");
                        localStorage.setItem("token", newAccessToken);

                        // 헤더 업데이트 후 재요청
                        headers["Authorization"] = `Bearer ${newAccessToken}`;
                        response = await fetch(`${BASE_URL}${url}`, {
                            ...options,
                            headers: headers,
                        });
                    } else {
                        console.warn("❌ 리프레시 토큰 만료 또는 유효하지 않음. 로그아웃 처리.");
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("userType");
                        // 필요한 경우 로그인 페이지로 이동
                        window.location.href = `${import.meta.env.BASE_URL}src/pages/login/index.html`;
                    }
                } catch (refreshError) {
                    console.error("❌ 토큰 갱신 중 오류 발생:", refreshError);
                }
            } else {
                // 리프레시 토큰이 없거나 리프레시 요청 자체가 실패한 경우
                if (
                    !url.includes("/accounts/token/refresh/") &&
                    !url.includes("/accounts/login/") &&
                    !url.includes("/accounts/validate-username/")
                ) {
                    console.warn("❌ 인증 실패 (토큰 없음). 로그아웃 처리.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.href = `${import.meta.env.BASE_URL}src/pages/login/index.html`;
                }
            }
        }

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
}

// Auth
export const login = (username, password) => {
    return request("/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
};

export const checkId = (username) => {
    return request("/accounts/validate-username/", {
        method: "POST",
        body: JSON.stringify({ username }),
    });
};

export const checkBusinessNumber = (businessNumber) => {
    return request("/accounts/seller/validate-registration-number/", {
        method: "POST",
        body: JSON.stringify({ company_registration_number: businessNumber }),
    });
};

export const signup = (userData, userType) => {
    const url = userType === "SELLER" ? "/accounts/seller/signup/" : "/accounts/buyer/signup/";
    return request(url, {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

// Products
export async function getProducts() {
    return await request("/products/", {
        method: "GET",
    });
}

export const getProductDetail = (id) => {
    return request(`/products/${id}/`);
};

export const searchProducts = (keyword) => {
    return request(`/products/?search=${encodeURIComponent(keyword)}`);
};

// Cart
export const getCart = () => {
    return request("/cart/");
};

export const addToCart = (data) => {
    return request("/cart/", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateCartItem = (cartId, quantity) => {
    return request(`/cart/${cartId}/`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
    });
};

export const deleteCartItem = (cartId) => {
    return request(`/cart/${cartId}/`, {
        method: "DELETE",
    });
};

// Order
export const order = (data) => {
    return request("/order/", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

// Seller
export const getSellerProducts = (accountName) => {
    return request(`/${accountName}/products/`);
};

export const createProduct = (formData) => {
    return request("/products/", {
        method: "POST",
        body: formData,
    });
};

export const updateProduct = (id, formData) => {
    return request(`/products/${id}/`, {
        method: "PUT",
        body: formData,
    });
};

export const deleteProduct = (id) => {
    return request(`/products/${id}/`, {
        method: "DELETE",
    });
};
