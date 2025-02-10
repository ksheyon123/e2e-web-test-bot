// app.js
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
require("dotenv").config();

const router = require("./router/endpoint");

const app = express();
const port = 8080;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 정적 파일 제공
app.use(express.static("public"));

app.use("/automate", router);

// 스크린샷 디렉토리 생성
const screenshotsDir = "./public/screenshots";
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});
