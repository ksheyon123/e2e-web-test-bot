const express = require("express");
const router = express.Router();

router.post("/submit", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({});
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
