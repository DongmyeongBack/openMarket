import{f as p,h as g,g as f,i as h}from"./api-CVDx6PwF.js";/* empty css               */import{d as b}from"./Modal-CoTgg4te.js";import{F as I}from"./Footer-DnPTH6_A.js";const i=document.getElementById("product-list"),l=document.getElementById("seller-title"),y=document.getElementById("product-count-badge"),w=document.getElementById("product-count-tab"),m=document.getElementById("upload-btn"),u=document.getElementById("footer");u&&new I(u);const E=t=>new Intl.NumberFormat("ko-KR").format(t),v=t=>{const a=t.image?t.image:"../../assets/images/default-image.png";return`
        <li class="product-item" data-id="${t.product_id||t.id}">
            <div class="item-info">
                <img 
                    src="${a}" 
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
            <div class="item-price">${E(t.price)}원</div>
            
            <div class="item-edit">
                <button class="btn-small btn-update">수정</button>
                <button class="btn-small btn-copy">복사</button>
            </div>
            
            <div class="item-delete">
                <button class="btn-small btn-delete">삭제</button>
            </div>
        </li>
    `},B=()=>{const t=localStorage.getItem("name");if(l){const a=t.replace(/님$/,"");l.textContent=`${a}님`,console.log(l.textContent)}},L=async()=>{const t=localStorage.getItem("token"),a=localStorage.getItem("name");if(!t||!a){alert("로그인이 필요한 서비스입니다."),window.location.href="/src/pages/login/index.html";return}B();try{const r=await p(a);console.log("data",r);const e=r.results||[],n=r.count||e.length;if(y.textContent=n,w.textContent=n,i.innerHTML="",e.length===0){i.innerHTML='<li class="no-data">등록된 상품이 없습니다.</li>';return}e.forEach(d=>{i.innerHTML+=v(d)}),_()}catch(r){console.error("상품을 불러오는 데 실패했습니다.",r),i.innerHTML=`<li class="no-data">데이터를 불러오지 못했습니다.<br>(${r.message})</li>`}},_=()=>{document.querySelectorAll(".btn-delete").forEach(e=>{e.addEventListener("click",async n=>{const s=n.target.closest(".product-item").dataset.id;if(await b())try{await g(s),alert("상품이 삭제되었습니다."),window.location.reload()}catch(o){console.error("삭제 실패",o),alert("삭제 실패")}})}),document.querySelectorAll(".btn-update").forEach(e=>{e.addEventListener("click",n=>{const s=n.target.closest(".product-item").dataset.id;window.location.href=`./product-upload/index.html?id=${s}`})}),document.querySelectorAll(".btn-copy").forEach(e=>{e.addEventListener("click",async n=>{if(!confirm("상품을 복사하시겠습니까?"))return;const s=n.target.closest(".product-item").dataset.id;try{const c=await f(s),o=new FormData;o.append("product_name",`[복사] ${c.product_name}`),o.append("price",c.price),o.append("shipping_method",c.shipping_method),o.append("shipping_fee",c.shipping_fee),o.append("stock",0),o.append("product_info",c.product_info),await h(o),alert("상품이 복사되었습니다. (이미지는 수정에서 다시 등록해주세요)"),window.location.reload()}catch(c){console.error("복사 실패",c),alert("복사 중 오류가 발생했습니다.")}})})};m&&m.addEventListener("click",()=>{window.location.href="./product-upload/index.html"});document.addEventListener("DOMContentLoaded",L);
