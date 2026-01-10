import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    // 이 설정을 넣어야 빌드 시 login/index.html 등을 인식합니다.
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "src/pages/login/index.html"),
            },
        },
    },
});
