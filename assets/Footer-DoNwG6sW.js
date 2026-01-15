function v(){document.body.insertAdjacentHTML("beforeend",`
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
    `);const t=document.getElementById("loginModal"),e=()=>{t&&t.remove()};document.getElementById("modalClose").addEventListener("click",e),document.getElementById("modalNo").addEventListener("click",e),t.addEventListener("click",a=>{a.target===t&&e()}),document.getElementById("modalYes").addEventListener("click",()=>{e(),window.location.href="/src/pages/login/index.html"})}function p(){return new Promise(l=>{document.body.insertAdjacentHTML("beforeend",`
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
        `);const e=document.getElementById("deleteModal"),a=document.getElementById("deleteModalClose"),n=document.getElementById("deleteCancel"),i=document.getElementById("deleteConfirm"),c=s=>{e&&e.remove(),l(s)};a.addEventListener("click",()=>c(!1)),n.addEventListener("click",()=>c(!1)),e.addEventListener("click",s=>{s.target===e&&c(!1)}),i.addEventListener("click",()=>c(!0))})}function b(){document.body.insertAdjacentHTML("beforeend",`
        <div class="modal-overlay" id="cartMoveModal">
            <div class="modal-box">
                <button class="modal-close-btn" id="cartModalClose">&times;</button>

                <p class="modal-text">
                    이미 장바구니에 있는 상품입니다.<br>
                    장바구니로 이동하시겠습니까?
                </p>

                <div class="modal-actions">
                    <button class="modal-btn btn-no" id="cartModalNo">아니오</button>
                    <button class="modal-btn btn-yes" id="cartModalYes">예</button>
                </div>
            </div>
        </div>
    `),document.getElementById("cartModalClose").onclick=m,document.getElementById("cartModalNo").onclick=m,document.getElementById("cartModalYes").onclick=()=>{console.log("장바구니로 이동"),m()}}function m(){const l=document.getElementById("cartMoveModal");l&&l.remove()}class h{constructor(t){this.$target=t,this.token=localStorage.getItem("token"),this.userType=localStorage.getItem("userType"),console.log("👤 유저 상태:",this.token?"회원(토큰 있음)":"비회원(토큰 없음)"),this.render(),this.setEvent()}template(){const t=`
            <div class="logo">
                <a href="/">
                    <img src="/src/assets/images/Logo-hodu.png" alt="HODU" class="logo-img">
                </a>
            </div>
        `,e=this.userType==="SELLER"?"":`
            <div class="search-container">
                <input type="text" class="search-input" placeholder="상품을 검색해보세요!">
                <button class="search-btn"></button>
                <ul id="search-results" class="search-results"></ul>
            </div>
        `;let a="";return this.token?this.userType==="SELLER"?a=`
                <div class="my-page-wrapper">
                    <button id="my-page-btn" class="nav-btn">
                        <img src="/src/assets/images/icon-user.svg" alt="마이페이지">
                        <span>마이페이지</span>
                    </button>
                    <div class="my-page-dropdown" id="dropdown-menu">
                        <button class="dropdown-item">마이페이지</button>
                        <button class="dropdown-item" id="logout-btn">로그아웃</button>
                    </div>
                </div>
                <a href="/src/pages/seller-center/index.html" class="btn-seller-center">
                    <img src="/src/assets/images/icon-shopping-bag.svg" alt="쇼핑백">
                    판매자 센터
                </a>
            `:a=`
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <div class="my-page-wrapper">
                    <button id="my-page-btn" class="nav-btn">
                        <img src="/src/assets/images/icon-user.svg" alt="마이페이지">
                        <span>마이페이지</span>
                    </button>
                    <div class="my-page-dropdown" id="dropdown-menu">
                        <button class="dropdown-item">마이페이지</button>
                        <button class="dropdown-item" id="logout-btn">로그아웃</button>
                    </div>
                </div>
            `:a=`
                <button id="cart-btn" class="nav-btn">
                    <img src="/src/assets/images/icon-shopping-cart.svg" alt="장바구니">
                    <span>장바구니</span>
                </button>
                <a href="/src/pages/login/index.html" class="nav-btn">
                    <img src="/src/assets/images/icon-user.svg" alt="로그인">
                    <span>로그인</span>
                </a>
            `,`
            <div class="header-container">
                ${t}
                ${e}
                <div class="nav-items">
                    ${a}
                </div>
            </div>
        `}render(){this.$target.innerHTML=this.template()}async fetchProducts(t){try{const e=new URL("https://api.wenivops.co.kr/services/open-market/products/");e.searchParams.append("search",t),console.log(`📡 요청 URL: ${e.toString()}`);const a={"Content-Type":"application/json"};this.token&&(a.Authorization=`Bearer ${this.token}`);const n=await fetch(e,{method:"GET",headers:a});return n.ok?(await n.json()).results||[]:(console.error(`❌ API 오류: ${n.status}`),[])}catch(e){return console.error("❌ 네트워크 에러:",e),[]}}setEvent(){const t=this.$target.querySelector("#cart-btn"),e=this.$target.querySelector("#my-page-btn"),a=this.$target.querySelector("#logout-btn"),n=this.$target.querySelector("#dropdown-menu"),i=this.$target.querySelector(".search-input"),c=this.$target.querySelector(".search-btn");let s=this.$target.querySelector("#search-results");if(i){s||(s=document.createElement("ul"),s.id="search-results",s.className="search-results",i.parentElement.appendChild(s)),i.addEventListener("input",async o=>{const r=o.target.value.trim();if(r===""){s.style.display="none";return}const u=await this.fetchProducts(r);u.length>0?(s.innerHTML=u.slice(0,10).map(g=>`
                        <li class="search-item" data-id="${g.id}">
                            ${g.name}
                        </li>
                    `).join(""),s.style.display="block"):s.style.display="none"}),s.addEventListener("click",o=>{const r=o.target.closest(".search-item");r&&(window.location.href=`/src/pages/product-detail/index.html?productId=${r.dataset.id}`)});const d=()=>{const o=i.value.trim();o&&(window.location.href=`/src/pages/product-list/index.html?search=${encodeURIComponent(o)}`)};c&&c.addEventListener("click",d),i.addEventListener("keydown",o=>{o.key==="Enter"&&d()}),document.addEventListener("click",o=>{o.target.closest(".search-container")||(s.style.display="none")})}t&&t.addEventListener("click",()=>{this.token?window.location.href="/src/pages/cart/index.html":v()}),e&&n&&(e.addEventListener("click",d=>{d.stopPropagation(),n.classList.toggle("active"),e.classList.toggle("active")}),document.addEventListener("click",d=>{d.target.closest(".nav-items")||(n.classList.remove("active"),e.classList.remove("active"))})),a&&a.addEventListener("click",()=>{localStorage.clear(),alert("로그아웃 되었습니다."),window.location.href="/"})}}class f{constructor(t){this.$target=t,this.render()}render(){const t=`
      <div class="footer-inner">
        <div class="footer-top">
          <ul class="footer-nav">
            <li><a href="#">호두샵 소개</a></li>
            <li><span class="divider">|</span></li>
            <li><a href="#">이용약관</a></li>
            <li><span class="divider">|</span></li>
            <li><a href="#" class="bold">개인정보처리방침</a></li>
            <li><span class="divider">|</span></li>
            <li><a href="#">전자금융거래약관</a></li>
            <li><span class="divider">|</span></li>
            <li><a href="#">청소년보호정책</a></li>
            <li><span class="divider">|</span></li>
            <li><a href="#">제휴문의</a></li>
          </ul>
          
          <div class="footer-sns">
            <a href="#" aria-label="Instagram">
              <img src="/src/assets/images/icon-insta.svg" alt="Instagram" />
            </a>
            <a href="#" aria-label="Facebook">
              <img src="/src/assets/images/icon-fb.svg" alt="Facebook" />
            </a>
            <a href="#" aria-label="Youtube">
              <img src="/src/assets/images/icon-yt.svg" alt="Youtube" />
            </a>
          </div>
        </div>

        <div class="footer-line"></div>

        <div class="footer-bottom">
          <strong class="company-name">(주)HODU SHOP</strong>
          <address class="company-info">
            제주특별자치도 제주시 동광고 137 제주코딩베이스캠프<br />
            사업자 번호 : 000-0000-0000 | 통신판매업<br />
            대표 : 김호두
          </address>
        </div>
      </div>
    `,e=document.createElement("footer");e.className="footer",e.innerHTML=t,this.$target.appendChild(e)}}export{f as F,h as H,b as a,p as b,v as s};
