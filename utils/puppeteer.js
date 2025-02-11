// Puppeteer 자동화 함수
const goToPage = async (page, url = "http://localhost:3000") => {
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

const setCriterion = async (page) => {
  await page.evaluate(() => {
    // 기존 커서가 있다면 제거
    const existingCursor = document.getElementById("custom-criterion");
    if (existingCursor) {
      existingCursor.remove();
    }

    const criterion = document.createElement("div");
    criterion.id = "custom-criterion";
    criterion.innerHTML = "criterion";
    criterion.style.cssText = `
        width: 40px;
        height: 40px;
        position: fixed;
        pointer-events: none;
        font-size: 8px;
        position: fixed;
        pointer-events: none;
        top : 0px;
        left : 0px;
        z-index: 9999;
        background: rgba(255, 0, 0, 0.6);
      `;
    document.body.appendChild(criterion);
  });
};

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

  await page.mouse.move(x, y, { steps: 50, delay: 300 });
};

const mouseClick = async (page, coord) => {
  const { x, y } = coord;
  await page.mouse.click(x, y);
};

module.exports = {
  setCriterion,
  runAutomation,
  goToPage,
  mouseMove,
  getScreenshot,
};
