import{f as m,u as f,d as y,b as k}from"./api-ZxrN8FjE.js";import{H as b}from"./Header-Dx3U_W5F.js";import{F as I}from"./Footer-DnPTH6_A.js";import{d as w,b as C}from"./Modal-paOObtiz.js";const $="data:image/svg+xml,%3csvg%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.14258%2018.2842L18.2847%204.14204'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3cpath%20d='M18.1426%2018.1421L4.00044%203.99996'%20stroke='%23C4C4C4'%20stroke-width='2'/%3e%3c/svg%3e",E=document.getElementById("header");new b(E);const v=document.getElementById("footer");new I(v);let s=[];const i=document.getElementById("cart-list"),p=document.getElementById("empty-cart"),g=document.getElementById("cart-summary"),d=document.querySelector(".btn-order-all"),S=document.getElementById("total-price"),_=document.getElementById("shipping-fee"),x=document.getElementById("final-amount"),n=document.getElementById("selectAll");async function L(){if(!localStorage.getItem("token")){C(),window.location.href="/openMarket/src/pages/login/index.html";return}try{const e=await y();e.count===0||!e.results?s=[]:s=(await Promise.all(e.results.map(async c=>{try{const o=await k(c.product.id);return{...c,product:{...c.product,stock:o.stock}}}catch{return c}}))).map(c=>{const o=c.product.stock!==void 0?c.product.stock:999,a=o===0;return{cart_id:c.id,product_id:c.product.id,seller:c.product.seller.store_name,name:c.product.name,price:c.product.price,shipping:c.product.shipping_fee,image:c.product.image,quantity:c.quantity,stock:o,isChecked:!a}}),l()}catch(e){(e.status===401||e.status===403)&&(alert("로그인 정보가 만료되었거나 접근 권한이 없습니다."),window.location.href="/openMarket/src/pages/login/index.html")}}function l(){if(s.length===0){i.style.display="none",g.style.display="none",d.style.display="none",p.style.display="block";return}if(p.style.display="none",i.style.display="block",g.style.display="flex",d.style.display="block",i.innerHTML=s.map(t=>{const e=t.stock===0;return`
    <li class="cart-item ${e?"out-of-stock":""}" data-cart-id="${t.cart_id}" data-product-id="${t.product_id}">
        <input type="checkbox" class="checkbox" ${t.isChecked?"checked":""} ${e?"disabled":""}>
        
        <a href="/openMarket/src/pages/product-detail/index.html?productId=${t.product_id}" class="product-img-link">
            <img src="${t.image}" alt="${t.name}" class="product-img">
            ${e?'<div class="sold-out-overlay">품절</div>':""}
        </a>
        
        <div class="product-info">
            <p class="seller-name">${t.seller}</p>
            <p class="product-name">${t.name}</p>
            <p class="product-price">${t.price.toLocaleString()}원</p>
            <p class="shipping-info">
                ${t.shipping>0?`${t.shipping.toLocaleString()}원`:"무료배송"}
            </p>
        </div>
        
        <div class="quantity-ctrl">
            <button type="button" class="minus" ${e?"disabled":""}>-</button>
            <span>${t.quantity}</span>
            <button type="button" class="plus" ${e?"disabled":""}>+</button>
        </div>
        <div class="item-total">
            <p class="item-total-price">${(t.price*t.quantity).toLocaleString()}원</p>
            <button class="btn-order-single" ${e?"disabled":""}>
                ${e?"품절":"주문하기"}
            </button>
        </div>
        <button class="btn-delete">
            <img src="${$}" alt="삭제" />
        </button>
    </li>
`}).join(""),u(),s.length>0){const t=s.filter(e=>e.stock>0);t.length===0?(n.checked=!1,n.disabled=!0):(n.checked=t.every(e=>e.isChecked),n.disabled=!1)}else n.checked=!1}function u(){const t=s.filter(o=>o.isChecked),e=t.reduce((o,a)=>o+a.price*a.quantity,0),r=t.reduce((o,a)=>o+a.shipping,0);S.textContent=e.toLocaleString(),_.textContent=r.toLocaleString();const c=e+r;x.textContent=c.toLocaleString()}async function h(t,e){try{return await f(t,e)}catch{return alert("수량 변경에 실패했습니다."),null}}i.addEventListener("click",async t=>{const e=t.target.closest(".cart-item");if(!e)return;const r=parseInt(e.dataset.cartId),c=s.find(o=>o.cart_id===r);if(c){if(t.target.classList.contains("plus")){const o=c.quantity+1,a=await h(r,o);a&&(c.quantity=a.quantity,l())}else if(t.target.classList.contains("minus"))if(c.quantity>1){const o=c.quantity-1,a=await h(r,o);a&&(c.quantity=a.quantity,l())}else alert("최소 수량은 1개입니다.");else if(t.target.closest(".btn-delete")){if(await w())try{await m(r),s=s.filter(a=>a.cart_id!==r),l()}catch{alert("상품 삭제 처리에 실패했습니다.")}}else if(t.target.classList.contains("btn-order-single")){const o={order_kind:"cart_order",product_ids:[c.product_id]};localStorage.setItem("order_data",JSON.stringify(o)),window.location.href="/openMarket/src/pages/payment/index.html"}}});i.addEventListener("change",t=>{if(t.target.classList.contains("checkbox")){const e=t.target.closest(".cart-item"),r=parseInt(e.dataset.cartId),c=s.find(o=>o.cart_id===r);if(c){c.isChecked=t.target.checked;const o=s.every(a=>a.isChecked);n.checked=o,u()}}});n.addEventListener("change",t=>{const e=t.target.checked;s.forEach(c=>{c.stock>0&&(c.isChecked=e)}),document.querySelectorAll(".cart-item .checkbox").forEach(c=>{c.checked=e}),u()});d.addEventListener("click",()=>{if(s.length===0){alert("장바구니에 담긴 상품이 없습니다.");return}const t=s.filter(r=>r.isChecked);if(t.length===0){alert("주문할 상품을 선택해주세요.");return}const e={order_kind:"cart_order",product_ids:t.map(r=>r.product_id)};localStorage.setItem("order_data",JSON.stringify(e)),window.location.href="/openMarket/src/pages/payment/index.html"});L();
