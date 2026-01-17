import{h as m,i as u}from"./api-BW4WmqIz.js";import{d as p}from"./Modal-paOObtiz.js";import{F as g}from"./Footer-DnPTH6_A.js";const s=document.getElementById("product-list"),d=document.getElementById("seller-title"),f=document.getElementById("product-count-badge"),b=document.getElementById("product-count-tab"),l=document.getElementById("upload-btn"),i=document.getElementById("footer");i&&new g(i);const h=t=>new Intl.NumberFormat("ko-KR").format(t),I=t=>{const n=t.image?t.image:"../../assets/images/default-image.png";return`
        <li class="product-item" data-id="${t.id}">
            <div class="item-info">
                <img 
                    src="${n}" 
                    alt="${t.name}" 
                    class="item-img" 
                    onclick="location.href='/openMarket/src/pages/product-detail/index.html?productId=${t.id}'"
                    style="cursor: pointer;" 
                >
                <div class="item-details">
                    <span class="item-name">${t.name}</span>
                    <span class="item-stock">재고 : ${t.stock}개</span>
                </div>
            </div>
            <div class="item-price">${h(t.price)}원</div>
            
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
                <button class="btn-small btn-copy">복사</button>
            </div>
            
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `},y=()=>{const t=localStorage.getItem("name");if(d){const n=t.replace(/ 님$/,"");d.textContent=`${n}님`}},E=async()=>{const t=localStorage.getItem("token"),n=localStorage.getItem("name");if(!t||!n){alert("로그인이 필요한 서비스입니다."),window.location.href="./src/pages/login/index.html";return}y();try{const c=await m(n),e=c.results||[],o=c.count;if(f.textContent=o,b.textContent=o,s.innerHTML="",e.length===0){s.innerHTML='<li class="no-data">등록된 상품이 없습니다.</li>';return}e.forEach(a=>{s.innerHTML+=I(a)}),v()}catch(c){s.innerHTML=`<li class="no-data">데이터를 불러오지 못했습니다.<br>(${c.message})</li>`}},v=()=>{document.querySelectorAll(".btn-delete").forEach(e=>{e.addEventListener("click",async o=>{const r=o.target.closest(".product-item").dataset.id;if(await p())try{await u(r),alert("상품이 삭제되었습니다."),window.location.reload()}catch{alert("삭제 실패")}})}),document.querySelectorAll(".btn-update").forEach(e=>{e.addEventListener("click",o=>{const r=o.target.closest(".product-item").dataset.id;window.location.href=`./product-upload/index.html?id=${r}`})}),document.querySelectorAll(".btn-copy").forEach(e=>{e.addEventListener("click",o=>{if(!confirm("이 상품의 정보로 새로운 상품을 등록하시겠습니까? (상품 등록 페이지로 이동합니다)"))return;const r=o.target.closest(".product-item").dataset.id;window.location.href=`./product-upload/index.html?id=${r}&mode=copy`})})};l&&l.addEventListener("click",()=>{window.location.href="./product-upload/index.html"});document.addEventListener("DOMContentLoaded",E);
