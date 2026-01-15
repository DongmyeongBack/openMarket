import "./Modal.css";

/**
 * 로그인 요청 모달 (단순 알림 및 이동용)
 */
export function showLoginModal() {
  // 1. 모달 HTML 구조 생성
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

  // 2. DOM에 추가
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 3. 요소 선택
  const modal = document.getElementById("loginModal");

  // 4. 닫기 함수
  const closeModal = () => {
    if (modal) modal.remove();
  };

  // 5. 이벤트 연결
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalNo").addEventListener("click", closeModal);

  // 배경 클릭 시 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // [예] 버튼 클릭 시 이동
  document.getElementById("modalYes").addEventListener("click", () => {
    closeModal();
    window.location.href = "/src/pages/login/index.html";
  });
}

/**
 * 삭제 확인 모달
 * @returns {Promise<boolean>} 확인 버튼 클릭 시 true, 취소/닫기 시 false 반환
 */
export function showDeleteModal() {
  return new Promise((resolve) => {
    // 1. 모달 HTML 구조 생성 (ID가 delete... 로 시작함에 유의)
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

    // 2. DOM에 추가
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 3. 요소 선택
    const modal = document.getElementById("deleteModal");
    const closeBtn = document.getElementById("deleteModalClose");
    const cancelBtn = document.getElementById("deleteCancel");
    const confirmBtn = document.getElementById("deleteConfirm");

    // 4. 닫기 및 결과 반환 함수
    const handleClose = (result) => {
      if (modal) modal.remove();
      resolve(result); // Promise 해결 (true 또는 false)
    };

    // 5. 이벤트 연결

    // 닫기/취소 (false 반환)
    closeBtn.addEventListener("click", () => handleClose(false));
    cancelBtn.addEventListener("click", () => handleClose(false));

    // 배경 클릭 시 닫기
    modal.addEventListener("click", (e) => {
      if (e.target === modal) handleClose(false);
    });

    // 확인 (true 반환) -> 실제 삭제 로직은 cart.js에서 수행
    confirmBtn.addEventListener("click", () => handleClose(true));
  });
}

export function showStockLimitModal() {
  const modalHTML = `
        <div class="modal-overlay" id="stockLimitModal">
            <div class="modal-box">
                <button class="modal-close-btn" id="stockModalClose">&times;</button>

                <p class="modal-text">
                    재고 수량이 초과되었습니다.
                </p>

                <div class="modal-actions">
                    <button class="modal-btn btn-no" id="stockModalNo">아니오</button>
                    <button class="modal-btn btn-yes" id="stockModalYes">예</button>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 닫기 처리
  document.getElementById("stockModalClose").onclick = closeStockModal;
  document.getElementById("stockModalNo").onclick = closeStockModal;

  document.getElementById("stockModalYes").onclick = () => {
    // ✅ 예 버튼 클릭 시 처리 로직
    console.log("재고 초과 상태에서 계속 진행");
    closeStockModal();
  };
}

function closeStockModal() {
  const modal = document.getElementById("stockLimitModal");
  if (modal) modal.remove();
}
