// 설정: API 주소 (실제 백엔드 주소로 변경 필요)
const API_URL = "https://api.wenivops.co.kr/services/open-market"; // 예시 URL

const productGrid = document.getElementById("product-grid");

// 1. 상품 목록 가져오기 함수
async function fetchProducts() {
    const token = sessionStorage.getItem("token"); // 로그인 시 저장된 토큰이 있다고 가정

    try {
        const res = await fetch(`${API_URL}/products/`, {
            method: "GET",
            headers: {
                // 토큰이 있으면 넣고, 없으면 헤더에서 제외하거나 빈 값 (API 명세에 따라 조정)
                ...(token && { Authorization: `Bearer ${token}` }),
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("상품 데이터를 불러오는데 실패했습니다.");
        }

        const data = await res.json();

        // API 명세에 따르면 data.results 배열에 상품 정보가 들어있음
        renderProducts(data.results);
    } catch (error) {
        console.error("Error:", error);
        productGrid.innerHTML = `<p class="error-message show">상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>`;
    }
}

// 2. 화면 렌더링 함수
function renderProducts(products) {
    // 상품이 없을 경우
    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';
        return;
    }

    // HTML 조각 생성
    const productItems = products
        .map((product) => {
            // 가격 콤마 찍기 (예: 29000 -> 29,000)
            const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);

            // 상세 페이지로 이동할 때 ID를 쿼리 스트링으로 전달 (예: ?id=1)
            return `
      <li class="product-card">
        <a href="/src/pages/product-detail/index.html?productId=${product.id}">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="product-img"
            onerror="this.src='../../assets/images/default-image.png'" 
          />
          <span class="seller-name">${product.seller.store_name || product.seller.username}</span>
          <h3 class="product-name">${product.name}</h3>
          <strong class="product-price">${formattedPrice}<span>원</span></strong>
        </a>
      </li>
    `;
        })
        .join("");

    // DOM에 주입
    productGrid.innerHTML = productItems;
}

// 3. 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();

    // (선택사항) 헤더, 푸터 컴포넌트 로드 함수가 있다면 여기서 호출
    // loadHeader();
    // loadFooter();
});
