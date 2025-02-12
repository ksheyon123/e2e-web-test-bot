import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.post("/submit", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    res.status(200).json({});
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

export default router;
