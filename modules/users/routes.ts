import { Router } from "express";
import { validateNewUser, validateUpdateUser } from "./validator";
import { BadRequestError, MissingFieldError } from "../common/errors";

const router = Router();

router.get("/info", async (req, res) => {
  const { userId } = req.query;

  try {
    res.status(200).json({});
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.post("/create", validateNewUser, async (req, res) => {
  const { username, name, email } = req.body;

  try {
    res.status(200).json({});
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.patch("/update", validateUpdateUser, async (req, res) => {
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
