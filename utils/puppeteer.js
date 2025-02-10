// Puppeteer 자동화 함수
const screenshotsDir = "./public/screenshots";
async function runAutomation(browser) {
  // 테스트용 로그인 정보
  const email = "test@example.com";
  const password = "testpassword123";
  console.log(browser);
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    // React 로그인 페이지로 이동
    console.log("로그인 페이지로 이동 시도...");
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // 로그인 시도 전 스크린샷
    await page.screenshot({
      path: `${screenshotsDir}/before-login.png`,
    });

    console.log("마우스 이동...");
    mouseMove(page, { x: 400, y: 230 });
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

const mouseMove = async (page, coord) => {
  const { x, y } = coord;

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
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.2);
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      `;
      document.body.appendChild(cursor);
      cursor.style.left = posX + "px";
      cursor.style.top = posY + "px";
    },
    x,
    y
  );

  await page.mouse.move(x, y, { steps: 50, delay: 100 });
};

const mouseClick = async (page, coord) => {
  const { x, y } = coord;
  await page.mouse.click(x, y);
};

module.exports = {
  runAutomation,
  mouseMove,
};
