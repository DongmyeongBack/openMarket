import"./common-D2-4OkSc.js";import{r as d}from"./api-DvCEykNh.js";const a=document.getElementById("product-list"),l=document.getElementById("seller-name-title"),r=document.getElementById("product-count-badge"),i=document.getElementById("product-count-tab"),m=document.getElementById("upload-btn"),u=t=>new Intl.NumberFormat("ko-KR").format(t),p=t=>{const o=t.image?t.image:"../../assets/images/default-image.png";return`
        <li class="product-item" data-id="${t.product_id}">
            <div class="item-info">
                <img src="${o}" alt="${t.product_name}" class="item-img">
                <div class="item-details">
                    <span class="item-name">${t.product_name}</span>
                    <span class="item-stock">재고 : ${t.stock}개</span>
                </div>
            </div>
            <div class="item-price">${u(t.price)}원</div>
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
            </div>
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `},g=async()=>{const t=localStorage.getItem("token"),o=localStorage.getItem("name");if(!t||!o){alert("로그인이 필요한 서비스입니다."),window.location.href="/pages/login/index.html";return}l.textContent=o;try{const e=await d(`/${o}/products/`);console.log(e);const n=e.results,s=e.count||n.length;if(r.textContent=s,i.textContent=s,a.innerHTML="",n.length===0){a.innerHTML='<li class="no-data">등록된 상품이 없습니다.</li>';return}n.forEach(c=>{a.innerHTML+=p(c)}),I()}catch(e){console.error("상품을 불러오는 데 실패했습니다.",e),a.innerHTML=`<li class="no-data">데이터 로드 실패: ${e.message}</li>`}},I=()=>{document.querySelectorAll(".btn-delete").forEach(e=>{e.addEventListener("click",n=>{const c=n.target.closest(".product-item").dataset.id;confirm("정말 이 상품을 삭제하시겠습니까?")&&alert(`상품 ID ${c} 삭제 API를 호출해야 합니다.`)})}),document.querySelectorAll(".btn-update").forEach(e=>{e.addEventListener("click",n=>{const c=n.target.closest(".product-item").dataset.id;alert(`상품 ID ${c} 수정 페이지로 이동합니다.`)})})};m.addEventListener("click",()=>{window.location.href="./product-upload/index.html"});document.addEventListener("DOMContentLoaded",g);
