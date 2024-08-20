import { Router } from "express";

const router = Router();

router.get("/info", async (req, res) => {
  const { userId } = req.query;

  try {
    res.status(200).json({});
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.post("/create", async (req, res) => {
  const { username, name, email } = req.body;

  try {
    res.status(200).json({});
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.patch("/update", async (req, res) => {
  const { userId } = req.query;
  const { username, name, email } = req.body;

  try {
    res.status(200).json({});
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.delete("/delete", async (req, res) => {
  const { userId } = req.query;
  const { username, name, email } = req.body;

  try {
    res.status(200).json({});
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

export default router;
