import{f as g,h as f,g as h,i as b}from"./api-DBChI_ES.js";/* empty css               */import{b as I}from"./Modal-CPPkZPSa.js";import{F as y}from"./Footer-DnPTH6_A.js";const i=document.getElementById("product-list"),l=document.getElementById("store-title"),m=document.getElementById("seller-title"),E=document.getElementById("product-count-badge"),w=document.getElementById("product-count-tab"),u=document.getElementById("upload-btn"),p=document.getElementById("footer");p&&new y(p);const v=t=>new Intl.NumberFormat("ko-KR").format(t),B=t=>{const e=t.image?t.image:"../../assets/images/default-image.png";return`
        <li class="product-item" data-id="${t.product_id||t.id}">
            <div class="item-info">
                <img 
                    src="${e}" 
                    alt="${t.product_name}" 
                    class="item-img" 
                    onclick="location.href='/src/pages/product-detail/index.html?productId=${t.product_id||t.id}'"
                    style="cursor: pointer;" 
                >
                <div class="item-details">
                    <span class="item-name">${t.product_name||t.name}</span>
                    <span class="item-stock">재고 : ${t.stock}개</span>
                </div>
            </div>
            <div class="item-price">${v(t.price)}원</div>
            
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
                <button class="btn-small btn-copy">복사</button>
            </div>
            
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `},_=()=>{const t=localStorage.getItem("store_name")||"내 스토어",e=localStorage.getItem("name")||"판매자";if(l&&(l.textContent=t),m){const r=e.replace(/님$/,"");m.textContent=`${r}님`}},k=async()=>{if(!localStorage.getItem("token")||!accountName){alert("로그인이 필요한 서비스입니다."),window.location.href="/src/pages/login/index.html";return}_();try{const e=localStorage.getItem("name"),r=await g(e),o=r.results||[],c=r.count||o.length;if(E.textContent=c,w.textContent=c,i.innerHTML="",o.length===0){i.innerHTML='<li class="no-data">등록된 상품이 없습니다.</li>';return}o.forEach(d=>{i.innerHTML+=B(d)}),L()}catch(e){console.error("상품을 불러오는 데 실패했습니다.",e),i.innerHTML=`<li class="no-data">데이터를 불러오지 못했습니다.<br>(${e.message})</li>`}},L=()=>{document.querySelectorAll(".btn-delete").forEach(o=>{o.addEventListener("click",async c=>{const s=c.target.closest(".product-item").dataset.id;if(await I())try{await f(s),alert("상품이 삭제되었습니다."),window.location.reload()}catch(n){console.error("삭제 실패",n),alert("삭제 실패")}})}),document.querySelectorAll(".btn-update").forEach(o=>{o.addEventListener("click",c=>{const s=c.target.closest(".product-item").dataset.id;window.location.href=`./product-upload/index.html?id=${s}`})}),document.querySelectorAll(".btn-copy").forEach(o=>{o.addEventListener("click",async c=>{if(!confirm("상품을 복사하시겠습니까?"))return;const s=c.target.closest(".product-item").dataset.id;try{const a=await h(s),n=new FormData;n.append("product_name",`[복사] ${a.product_name}`),n.append("price",a.price),n.append("shipping_method",a.shipping_method),n.append("shipping_fee",a.shipping_fee),n.append("stock",0),n.append("product_info",a.product_info),await b(n),alert("상품이 복사되었습니다. (이미지는 수정에서 다시 등록해주세요)"),window.location.reload()}catch(a){console.error("복사 실패",a),alert("복사 중 오류가 발생했습니다.")}})})};u&&u.addEventListener("click",()=>{window.location.href="./product-upload/index.html"});document.addEventListener("DOMContentLoaded",k);
