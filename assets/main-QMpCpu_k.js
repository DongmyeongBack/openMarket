import"./common-D2-4OkSc.js";import{H as d,F as m}from"./Footer-DoNwG6sW.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.querySelector("#header");t&&new d(t);const n=document.querySelector("#footer");n&&new m(n)});const u="https://api.wenivops.co.kr/services/open-market",c=document.getElementById("product-grid"),l=document.querySelector(".banner-slide");let s=0;const i=5;async function p(){const t=sessionStorage.getItem("token");try{const n=await fetch(`${u}/products/`,{method:"GET",headers:{...t&&{Authorization:`Bearer ${t}`},"Content-Type":"application/json"}});if(!n.ok)throw new Error("상품 데이터를 불러오는데 실패했습니다.");const e=await n.json();f(e.results),g(e.results)}catch(n){console.error("Error:",n),c.innerHTML='<p class="error-message show">상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>'}}function f(t){if(!t||t.length===0){c.innerHTML='<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';return}const n=t.map(e=>{const r=new Intl.NumberFormat("ko-KR").format(e.price);return`
      <li class="product-card">
        <a href="/src/pages/product-detail/index.html?productId=${e.id}">
          <img 
            src="${e.image}" 
            alt="${e.name}" 
            class="product-img"
            onerror="this.src='../../assets/images/default-image.png'" 
          />
          <span class="seller-name">${e.seller.store_name||e.seller.username}</span>
          <h3 class="product-name">${e.name}</h3>
          <strong class="product-price">${r}<span>원</span></strong>
        </a>
      </li>
    `}).join("");c.innerHTML=n}function g(t){if(!t||t.length===0)return;const e=t.slice(0,i).map(r=>`<img src="${r.image}" alt="${r.name}" class="banner-img" />`).join("");l.innerHTML=e,h()}function h(){const t=document.querySelector(".prev-btn"),n=document.querySelector(".next-btn"),e=document.querySelectorAll(".dot");function r(o){o<0?s=i-1:o>=i?s=0:s=o,l.style.transform=`translateX(-${s*100}%)`,e.forEach(a=>a.classList.remove("active")),e[s].classList.add("active")}t.addEventListener("click",()=>r(s-1)),n.addEventListener("click",()=>r(s+1)),e.forEach((o,a)=>{o.addEventListener("click",()=>r(a))}),setInterval(()=>{r(s+1)},5e3)}p();
