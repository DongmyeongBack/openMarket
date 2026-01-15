// src/components/Modal/Modal.js

import "./Modal.css";
/**
 * 로그인 요청 모달을 띄우는 함수
 * @returns {Promise<boolean>} '예' 클릭 시 true, '아니오/닫기' 클릭 시 false 반환 (비동기 처리가 필요할 경우 대비)
 */
export function showLoginModal() {
    // 1. CSS 로드 (동적으로 CSS 파일이 없는 경우를 대비해 head에 추가하거나, 이미 import 되어 있다고 가정)
    // MPA 환경에서는 해당 페이지의 HTML이나 JS에서 Modal.css를 import 해야 스타일이 적용됩니다.

    // 2. 모달 HTML 구조 생성
    const modalHTML = `
        <div class="modal-overlay" id="loginModal">
            <div class="modal-box">
                <button class="modal-close-btn" id="modalClose">&times;</button>
                <p class="modal-text">
                    로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
                </p>
                <div class="modal-actions">
                    <button class="modal-btn btn-no" id="modalNo">아니오</button>
                    <button class="modal-btn btn-yes" id="modalYes">예</button>
                </div>
            </div>
        </div>
    `;
    export function showDeleteModal() {
    const modalHTML = `
        <div class="modal-overlay" id="deleteModal">
            <div class="modal-box delete-modal-box">
                <button class="modal-close-btn" id="deleteModalClose">&times;</button>

                <p class="modal-text">
                    상품을 삭제하시겠습니까?
                </p>

                <div class="modal-actions">
                    <button class="modal-btn btn-no" id="deleteCancel">취소</button>
                    <button class="modal-btn btn-yes" id="deleteConfirm">확인</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 닫기 이벤트
    document.getElementById('deleteModalClose').onclick = closeDeleteModal;
    document.getElementById('deleteCancel').onclick = closeDeleteModal;

    document.getElementById('deleteConfirm').onclick = () => {
        // 실제 삭제 로직은 여기서 처리
        console.log('상품 삭제 진행');
        closeDeleteModal();
    };
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.remove();
}

    // 3. Body에 추가
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 4. 요소 선택
    const modal = document.getElementById("loginModal");
    const closeBtn = document.getElementById("modalClose");
    const noBtn = document.getElementById("modalNo");
    const yesBtn = document.getElementById("modalYes");

    // 5. 닫기 함수 (모달 제거)
    const closeModal = () => {
        modal.remove();
    };

    // 6. 이벤트 리스너 연결

    // [아니오] 또는 [X] 버튼 클릭 시 -> 모달 닫기
    closeBtn.addEventListener("click", closeModal);
    noBtn.addEventListener("click", closeModal);

    // 배경 클릭 시 닫기 (옵션)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // [예] 버튼 클릭 시 -> 로그인 페이지로 이동
    yesBtn.addEventListener("click", () => {
        closeModal();
        // 로그인 페이지 경로로 이동 (프로젝트 구조에 맞게 경로 설정)
        window.location.href = "/src/pages/login/index.html";
    });
}
