// Puppeteer 자동화 함수
const goToPage = async (page, url = "http://localhost:3000/signin") => {
  console.log("로그인 페이지로 이동 시도...");
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
};

async function runAutomation(browser) {
  // 테스트용 로그인 정보
  const email = "test@example.com";
  const password = "testpassword123";
  console.log(browser);
  try {
    console.log("마우스 이동...");
    mouseMove(page, { x: 400, y: 230, delay: 100 });
    console.log("마우스 클릭...");
    mouseClick(page, { x: 400, y: 230 });

    // 이메일 입력 필드 대기 및 입력
    console.log("이메일 입력 시도...");
    await page.keyboard.type(email, { delay: 100 });

    // // 로그인 시도 후 스크린샷
    // await page.screenshot({
    //   path: `${screenshotsDir}/after-login.png`,
    // });

    // 페이지 상태 확인
    const results = await page.evaluate(() => {
      return {
        url: window.location.href,
        currentPath: window.location.pathname,
        html: document.documentElement.innerHTML,
        title: document.title,
      };
    });

    await browser.close();
    return results;
  } catch (error) {
    console.error("자동화 중 에러 발생:", error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

const getScreenshot = async (page, hash) => {
  try {
    // 로그인 시도 전 스크린샷
    await page.screenshot({
      path: `./public/screenshots/${hash}/default_screen.png`,
    });
  } catch (e) {
    throw e;
  }
};

const mouseMove = async (page, coord, size) => {
  const { x, y } = coord;
  const { width, height } = size;

  await page.evaluate(
    (posX, posY) => {
      // 기존 커서가 있다면 제거
      const existingCursor = document.getElementById("custom-cursor");
      if (existingCursor) {
        existingCursor.remove();
      }

      const cursor = document.createElement("div");
      cursor.id = "custom-cursor";
      cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid red;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        background: rgba(255, 0, 0, 0.2);
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      `;
      document.body.appendChild(cursor);
      cursor.style.left = posX + width / 2 + "px";
      cursor.style.top = posY + height / 2 + "px";
    },
    x,
    y
  );

  await page.mouse.move(x, y, { steps: 50, delay: 300 });
};

const mouseClick = async (page, coord) => {
  const { x, y } = coord;
  await page.mouse.click(x, y);
};

async function createGridOverlay(page) {
  await page.evaluate(() => {
    // SVG 네임스페이스
    const svgNS = "http://www.w3.org/2000/svg";

    // 그리드 설정
    const config = {
      width: 1920,
      height: 1080,
      divisions: 40,
      unitWidth: 1920 / 40, // 48px
      unitHeight: 1080 / 40, // 27px
      color: "rgba(0, 0, 255, 0.1)",
      labelColor: "rgba(0, 0, 0, 0.5)",
    };

    // SVG 엘리먼트 생성
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);
    svg.style.position = "fixed";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "9999";

    // 세로선 그리기
    for (let i = 0; i <= config.divisions; i++) {
      const x = i * config.unitWidth;
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", x);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", x);
      line.setAttribute("y2", config.height);
      line.setAttribute("stroke", config.color);
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);

      // 5의 배수 위치에 x좌표 라벨 추가
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x + 2);
      text.setAttribute("y", 15);
      text.setAttribute("fill", config.labelColor);
      text.setAttribute("font-size", "12");
      text.textContent = x.toString();
      svg.appendChild(text);
    }

    // 가로선 그리기
    for (let i = 0; i <= config.divisions; i++) {
      const y = i * config.unitHeight;
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", 0);
      line.setAttribute("y1", y);
      line.setAttribute("x2", config.width);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", config.color);
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);

      // 5의 배수 위치에 y좌표 라벨 추가
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", 5);
      text.setAttribute("y", y + 15);
      text.setAttribute("fill", config.labelColor);
      text.setAttribute("font-size", "12");
      text.textContent = y.toString();
      svg.appendChild(text);
    }

    // 그리드 토글을 위한 컨트롤 버튼 추가
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Toggle Grid";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.zIndex = "10000";
    toggleButton.style.padding = "8px";
    toggleButton.style.cursor = "pointer";
    toggleButton.onclick = () => {
      svg.style.display = svg.style.display === "none" ? "block" : "none";
    };

    // 요소들을 body에 추가
    document.body.appendChild(svg);
    document.body.appendChild(toggleButton);
  });
}

module.exports = {
  runAutomation,
  goToPage,
  mouseMove,
  getScreenshot,
  createGridOverlay,
};
