import express from "express";
import path from "path";

const router = express.Router();

// React 빌드 파일들을 서빙하기 위한 static 미들웨어 설정
router.use(express.static(path.resolve(__dirname, "../client/build")));

// 모든 요청에 대해 index.html 반환
router.get("/client", (req, res) => {
  console.log("Request path:", req.path);
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

export default router;
