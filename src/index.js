import Header from "/src/components/Header.js";

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
    const headerTarget = document.querySelector("#header");

    // Header 컴포넌트 생성 및 렌더링
    new Header(headerTarget);
});
