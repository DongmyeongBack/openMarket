import{f as m,h as u}from"./api-DOepU4-1.js";/* empty css               */import{b as p}from"./Modal-C9nBlRzj.js";import{F as g}from"./Footer-DnPTH6_A.js";const l=document.getElementById("product-list"),f=document.getElementById("seller-name-title"),d=document.getElementById("product-count-badge"),i=document.getElementById("product-count-tab"),h=document.getElementById("upload-btn"),b=document.getElementById("footer");new g(b);const v=t=>new Intl.NumberFormat("ko-KR").format(t),E=t=>{const s=t.image?t.image:"../../assets/images/default-image.png";return console.log("product",t),`
        <li class="product-item" data-id="${t.id}">
            <div class="item-info">
                <img src="${s}" alt="${t.product_name}" class="item-img">
                <div class="item-details">
                    <span class="item-name">${t.product_name}</span>
                    <span class="item-stock">재고 : ${t.stock}개</span>
                </div>
            </div>
            <div class="item-price">${v(t.price)}원</div>
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
            </div>
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `},I=async()=>{const t=localStorage.getItem("token"),s=localStorage.getItem("name");if(!t||!s){alert("로그인이 필요한 서비스입니다."),window.location.href="/pages/login/index.html";return}f.textContent=s;try{const e=await m(s);console.log(e);const o=e.results,n=e.count||o.length;if(d.textContent=n,i.textContent=n,l.innerHTML="",o.length===0){l.innerHTML='<li class="no-data">등록된 상품이 없습니다.</li>';return}o.forEach(a=>{l.innerHTML+=E(a)}),C()}catch(e){console.error("상품을 불러오는 데 실패했습니다.",e),l.innerHTML=`<li class="no-data">데이터 로드 실패: ${e.message}</li>`}},C=()=>{document.querySelectorAll(".btn-delete").forEach(e=>{e.addEventListener("click",async o=>{const n=o.target.closest(".product-item"),a=n.dataset.id;if(await p())try{await u(a),alert("상품이 삭제되었습니다."),n.remove();const c=parseInt(d.textContent);if(!isNaN(c)){const r=c-1;d.textContent=r,i.textContent=r,r===0&&(l.innerHTML='<li class="no-data">등록된 상품이 없습니다.</li>')}}catch(c){console.error("삭제 실패",c),alert(c.detail||"상품 삭제에 실패했습니다.")}})}),document.querySelectorAll(".btn-update").forEach(e=>{e.addEventListener("click",o=>{const n=o.target.closest(".product-item");console.log(n);const a=n.dataset.id;window.location.href=`./product-upload/index.html?id=${a}`})})};h.addEventListener("click",()=>{window.location.href="./product-upload/index.html"});document.addEventListener("DOMContentLoaded",I);
