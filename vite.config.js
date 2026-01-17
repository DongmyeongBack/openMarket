import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    // 배포할때만 다음 활성화
    base: '/openMarket/',

    esbuild: {
        drop: ['console', 'debugger'],
    },

    build: {
        rollupOptions: {
            input: {
                // 1. 메인 페이지
                main: resolve(__dirname, "index.html"),

                // 2. 로그인 페이지
                login: resolve(__dirname, "src/pages/login/index.html"),

                // 3. 회원가입 페이지
                signup: resolve(__dirname, "src/pages/signup/index.html"),

                // 4. 상품 상세
                productDetail: resolve(__dirname, "src/pages/product-detail/index.html"),

                // 5. 장바구니
                cart: resolve(__dirname, "src/pages/cart/index.html"),

                // 6. 판매자 센터 (폴더명이 seller-center인 경우)
                // *주의: 만약 폴더명이 'seller'라면 "src/pages/seller/index.html"로 유지하세요.
                sellerCenter: resolve(__dirname, "src/pages/seller-center/index.html"),

                // 7. [추가됨] 상품 등록 페이지
                productUpload: resolve(__dirname, "src/pages/seller-center/product-upload/index.html"),

                // 8. [NEW] 결제 페이지
                // 8. [NEW] 결제 페이지
                payment: resolve(__dirname, "src/pages/payment/index.html"),
            },
        },
    },
    server: {
        proxy: {
            "/proxy": {
                target: "https://api.wenivops.co.kr",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy/, ""),
                secure: false, // HTTPS 인증서 오류 무시 (필요시)
            },
        },
    },
    preview: {
        proxy: {
            "/proxy": {
                target: "https://api.wenivops.co.kr",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/proxy/, ""),
                secure: false,
            },
        },
    },
});
