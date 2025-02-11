const fs = require("fs");

// 스크린샷 디렉토리 생성
const screenshotsDir = "./public/screenshots";

const createScreenShotsDir = async () => {
  if (!fs.existsSync(screenshotsDir)) {
    await fs.mkdirSync(screenshotsDir, { recursive: true });
  }
};

const setScreenshots = async (hash) => {
  const dir = `${screenshotsDir}/${hash}`;
  // 스크린샷 디렉토리 생성
  if (!fs.existsSync(dir)) {
    await fs.mkdirSync(dir, { recursive: true });
  }
};

const getScreenshots = async (hash, filename) => {
  const dir = `${screenshotsDir}/${hash}/${filename}`;
  if (fs.existsSync(dir)) {
    return await fs.readFileSync(dir);
  } else {
    throw Error();
  }
};

module.exports = {
  createScreenShotsDir,
  setScreenshots,
  getScreenshots,
};
