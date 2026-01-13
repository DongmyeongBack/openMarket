import Header from "/src/components/Header/Header.js";
import Footer from "/src/components/Footer/Footer.js"; // [1] Footer 임포트

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
    // Header 렌더링
    const headerTarget = document.querySelector("#header");
    if (headerTarget) {
        new Header(headerTarget);
    }

    // [2] Footer 렌더링
    const footerTarget = document.querySelector("#footer"); // HTML에 id="footer"가 있어야 함
    if (footerTarget) {
        new Footer(footerTarget);
    }
});
