import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { createScreenShotsDir } from "./utils/fs";
import router from "./router/endpoint";
import api from "./router/api";
import reactRouter from "./router/react";

dotenv.config();

const app: Express = express();
const port: number = 8080;

createScreenShotsDir();

// 모든 도메인에서의 요청 허용
app.use(cors());

// 또는 특정 도메인만 허용
app.use(
  cors({
    origin: "http://localhost:8888", // React 앱의 주소
    credentials: true, // 쿠키/인증 헤더 허용 (필요한 경우)
  })
);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 정적 파일 제공
app.use(express.static("public"));

app.use("/automate", router);
app.use("/api", api);
app.use("/", reactRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
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
