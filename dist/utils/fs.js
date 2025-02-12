"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenshots = exports.setScreenshots = exports.createScreenShotsDir = void 0;
const fs_1 = __importDefault(require("fs"));
// 스크린샷 디렉토리 생성
const screenshotsDir = "./public/screenshots";
const createScreenShotsDir = async () => {
    if (!fs_1.default.existsSync(screenshotsDir)) {
        await fs_1.default.promises.mkdir(screenshotsDir, { recursive: true });
    }
};
exports.createScreenShotsDir = createScreenShotsDir;
const setScreenshots = async (hash) => {
    const dir = `${screenshotsDir}/${hash}`;
    // 스크린샷 디렉토리 생성
    if (!fs_1.default.existsSync(dir)) {
        await fs_1.default.promises.mkdir(dir, { recursive: true });
    }
};
exports.setScreenshots = setScreenshots;
const getScreenshots = async (hash, filename) => {
    const dir = `${screenshotsDir}/${hash}/${filename}`;
    if (fs_1.default.existsSync(dir)) {
        return await fs_1.default.promises.readFile(dir);
    }
    else {
        throw new Error("Screenshot not found");
    }
};
exports.getScreenshots = getScreenshots;
