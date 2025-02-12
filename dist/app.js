"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("./utils/fs");
const endpoint_1 = __importDefault(require("./router/endpoint"));
const api_1 = __importDefault(require("./router/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8080;
(0, fs_1.createScreenShotsDir)();
// 미들웨어 설정
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// 정적 파일 제공
app.use(express_1.default.static("public"));
app.use("/automate", endpoint_1.default);
app.use("/api", api_1.default);
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    // 또는 더 완벽한 캐시 비활성화를 위해:
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
    });
    next();
});
// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});
