import "./Footer.css"; // CSS 파일 연결

import iconInsta from "../../assets/images/icon-insta.svg";
import iconFb from "../../assets/images/icon-fb.svg";
import iconYt from "../../assets/images/icon-yt.svg";

export default class Footer {
  constructor($target) {
    this.$target = $target;
    this.render();
  }

  render() {
    // 렌더링할 HTML 템플릿
    const footerHtml = `
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
              <img src="${iconInsta}" alt="Instagram" />
            </a>
            <a href="#" aria-label="Facebook">
              <img src="${iconFb}" alt="Facebook" />
            </a>
            <a href="#" aria-label="Youtube">
              <img src="${iconYt}" alt="Youtube" />
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
    `;

    const footerElement = document.createElement("footer");
    footerElement.className = "footer";
    footerElement.innerHTML = footerHtml;

    this.$target.appendChild(footerElement);
  }
}
