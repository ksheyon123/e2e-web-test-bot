import fs from "fs";

// 스크린샷 디렉토리 생성
const screenshotsDir: string = "./public/screenshots";

const createScreenShotsDir = async (): Promise<void> => {
  if (!fs.existsSync(screenshotsDir)) {
    await fs.promises.mkdir(screenshotsDir, { recursive: true });
  }
};

const setScreenshots = async (hash: string): Promise<void> => {
  const dir: string = `${screenshotsDir}/${hash}`;
  // 스크린샷 디렉토리 생성
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};

const getScreenshots = async (
  hash: string,
  filename: string
): Promise<Buffer> => {
  const dir: string = `${screenshotsDir}/${hash}/${filename}`;
  if (fs.existsSync(dir)) {
    return await fs.promises.readFile(dir);
  } else {
    throw new Error("Screenshot not found");
  }
};

export { createScreenShotsDir, setScreenshots, getScreenshots };
