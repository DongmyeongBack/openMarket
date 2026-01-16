import "./Modal.css";

/**
 * 공통 모달 생성 함수
 * @param {Object} options
 * @param {string} options.id - 모달 ID
 * @param {string} options.content - 본문 HTML
 * @param {Array} options.actions - 버튼 설정
 * @param {Function} options.onClose - 닫기 콜백
 */
function createCommonModal({
    id,
    content = "",
    actions = [],
    onClose = null,
}) {
    // 1. 중복 방지
    const existingModal = document.getElementById(id);
    if (existingModal) existingModal.remove();

    // 2. 닫기 함수 정의 (호이스팅 방지)
    const closeModal = (triggerOnClose = true) => {
        document.removeEventListener("keydown", handleKeyDown); // 키보드 리스너 제거
        const modalEl = document.getElementById(id);
        if (modalEl) modalEl.remove();
        if (triggerOnClose && onClose) onClose();
    };

    // 3. 키보드 이벤트 핸들러 (ESC 지원)
    const handleKeyDown = (e) => {
        if (e.key === "Escape") closeModal(true);
    };

    // 4. HTML 생성
    const buttonsHTML = actions
        .map((btn, index) => `
            <button class="modal-btn ${btn.class || ''}" id="${id}-btn-${index}">
                ${btn.text}
            </button>
        `).join("");

    const modalHTML = `
        <div class="modal-overlay" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-content">
            <div class="modal-box" tabindex="-1">
                <button class="modal-close-btn" id="${id}-close" aria-label="닫기">&times;</button>
                <div class="modal-content" id="${id}-content">${content}</div>
                <div class="modal-actions">${buttonsHTML}</div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 5. 요소 바인딩
    const modal = document.getElementById(id);
    const closeBtn = document.getElementById(`${id}-close`);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(true);
    });

    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(true));
    document.addEventListener("keydown", handleKeyDown);

    // 6. 액션 버튼 이벤트 연결
    actions.forEach((btn, index) => {
        const btnEl = document.getElementById(`${id}-btn-${index}`);
        if (btnEl) {
            btnEl.addEventListener("click", () => {
                if (btn.onClick) {
                    btn.onClick(closeModal);
                } else {
                    closeModal(true);
                }
            });
        }
    });

    // 7. [접근성] 포커스 이동 (주요 버튼 or 닫기 버튼)
    const focusTarget = modal.querySelector(".btn-yes") ||
        modal.querySelector(".modal-actions button:last-child") ||
        closeBtn;
    if (focusTarget) focusTarget.focus();

    return closeModal;
}

/**
 * 로그인 요청 모달
 */
export function showLoginModal() {
    createCommonModal({
        id: "loginModal",
        content: `
            <p class="modal-text">
                로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?
            </p>
        `,
        actions: [
            {
                text: "아니오",
                class: "btn-no",
                onClick: (close) => close(),
            },
            {
                text: "예",
                class: "btn-yes",
                onClick: (close) => {
                    close();
                    // URL 템플릿 리터럴 공백 제거 및 정리
                    const loginUrl = `${import.meta.env.BASE_URL}src/pages/login/index.html`;
                    window.location.href = loginUrl;
                },
            },
        ],
    });
}

/**
 * 삭제 확인 모달
 * @returns {Promise<boolean>}
 */
export function showDeleteModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "deleteModal",
            content: `
                <p class="modal-text">상품을 삭제하시겠습니까?</p>
            `,
            actions: [
                {
                    text: "취소",
                    class: "btn-no",
                    onClick: (close) => {
                        close(); // 내부적으로 onClose 호출됨
                        resolve(false);
                    },
                },
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        // resolve(true)를 먼저 하고, 닫기 시 onClose 트리거를 막음(false)
                        close(false);
                        resolve(true);
                    },
                },
            ],
            // X 버튼이나 배경 클릭 시 false 반환
            onClose: () => resolve(false),
        });
    });
}

/**
 * 재고 초과 알림
 * @returns {Promise<boolean>} (진행 여부 반환 추가)
 */
export function showStockLimitModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "stockLimitModal",
            content: `
                <p class="modal-text">재고 수량이 초과되었습니다.</p>
            `,
            actions: [
                {
                    text: "아니오",
                    class: "btn-no",
                    onClick: (close) => {
                        close();
                        resolve(false);
                    }
                },
                {
                    text: "예",
                    class: "btn-yes",
                    onClick: (close) => {
                        console.log("재고 초과 상태에서 계속 진행");
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(false),
        });
    });
}

/**
 * 공용 장바구니 모달
 */
export function showCartModal({ message, confirmText = "확인", cancelText = "쇼핑 계속" }) {
    return new Promise((resolve) => {
        createCommonModal({
            id: "cartCommonModal",
            content: `<p class="modal-text">${message}</p>`,
            actions: [
                {
                    text: cancelText,
                    class: "btn-no",
                    onClick: (close) => {
                        close();
                        resolve(false);
                    },
                },
                {
                    text: confirmText,
                    class: "btn-yes",
                    onClick: (close) => {
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(false),
        });
    });
}

/**
 * 결제 오류 모달
 */
export function showPaymentErrorModal() {
    createCommonModal({
        id: "paymentErrorModal",
        // [수정] 결재 -> 결제, 오타 수정
        content: `
            <p class="modal-text">
                결제를 진행할 수 없습니다.<br>
                <span class="error-code">[Error Code: API_CONNECTION_ERROR]</span>
            </p>
        `,
        actions: [
            {
                text: "확인",
                class: "btn-yes",
                onClick: (close) => close(),
            },
        ],
    });
}

/**
 * 로그인 성공 모달
 */
export function showLoginSuccessModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "loginSuccessModal",
            content: `<p class="modal-text">로그인 되었습니다.</p>`,
            actions: [
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(true),
        });
    });
}

/**
 * 로그아웃 안내 모달
 */
export function showLogoutModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "logoutModal",
            content: `<p class="modal-text">로그아웃 되었습니다.</p>`,
            actions: [
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        close(false);
                        resolve(true);
                    },
                },
            ],
            onClose: () => resolve(true),
        });
    });
}

/**
 * 회원가입 성공 모달
 */
export function showSignupSuccessModal() {
    return new Promise((resolve) => {
        createCommonModal({
            id: "signupSuccessModal",
            content: `<p class="modal-text">회원 가입이 완료되었습니다.</p>`,
            actions: [
                {
                    text: "확인",
                    class: "btn-yes",
                    onClick: (close) => {
                        close(false);
                        resolve();
                    },
                },
            ],
            onClose: () => resolve(),
        });
    });
}


