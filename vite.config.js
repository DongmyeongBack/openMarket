import { defineConfig } from "vite";
import { resolve } from "path"; // path 모듈 불러오기

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // 1. 메인 페이지 (프로젝트 루트의 index.html)
                main: resolve(__dirname, "index.html"),

                // 2. 로그인 페이지
                login: resolve(__dirname, "src/pages/login/index.html"),

                // 3. 회원가입 페이지 (여기가 중요!)
                signup: resolve(__dirname, "src/pages/signup/index.html"),

                // 5. 상품 상세
                productDetail: resolve(__dirname, "src/pages/product-detail/index.html"),

                cart: resolve(__dirname, "src/pages/cart/index.html"),
                // 판매자 센터 추가
                seller: resolve(__dirname, "src/pages/seller/index.html"),
            },
        },
    },
});
