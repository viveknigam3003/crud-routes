import { Router } from "express";
import { UserService } from "./service";
import { validateNewUser, validateUpdateUserBody, validateUpdateUserQuery, validateUserInfoRequest } from "./validator";

const router = Router();
const Users = new UserService();

// key value pair 

// 3 endpoints -> get, set, delete
// get -> input: key
    // error code 404
// set -> input: key, value
    // if the limit is hit -> evict some key value to make space
    // random value -> random function
    // LRU
// del -> input: key

// arbitrary cap -> 5

// eviction

router.get("/info", validateUserInfoRequest, async (req, res) => {
  const { userId, username } = req.query;

  try {
    if (userId) {
      const user = await Users.getUserById({ userId: userId as string });

      res.status(200).json(user);
      return;
    }

    if (username) {
      const user = await Users.getUserByUsername({ username: username as string });

      res.status(200).json(user);
      return;
    }

  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.get("/info", validateUserInfoRequest, async (req, res) => {
  const { userId, username } = req.query;

  try {
    if (userId) {
      const user = await Users.getUserById({ userId: userId as string });

      res.status(200).json(user);
      return;
    }

    if (username) {
      const user = await Users.getUserByUsername({ username: username as string });

      res.status(200).json(user);
      return;
    }

  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.get("/info", validateUserInfoRequest, async (req, res) => {
  const { userId, username } = req.query;

  try {
    if (userId) {
      const user = await Users.getUserById({ userId: userId as string });

      res.status(200).json(user);
      return;
    }

    if (username) {
      const user = await Users.getUserByUsername({ username: username as string });

      res.status(200).json(user);
      return;
    }

  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});




router.get("/info", validateUserInfoRequest, async (req, res) => {
  const { userId, username } = req.query;

  try {
    if (userId) {
      const user = await Users.getUserById({ userId: userId as string });

      res.status(200).json(user);
      return;
    }

    if (username) {
      const user = await Users.getUserByUsername({ username: username as string });

      res.status(200).json(user);
      return;
    }

  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.post("/create", validateNewUser, async (req, res) => {
  const { username, name, email } = req.body;

  try {
    const newUser = await Users.createUser({ user: { username, name, email } });

    res.status(201).json(newUser);
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.patch("/update", validateUpdateUserQuery, validateUpdateUserBody, async (req, res) => {
  const { userId } = req.query;
  const { username, name, email } = req.body;

  try {
    const updatedUser = await Users.updateUser({
      userId: userId as string,
      user: { username, name, email },
    });

    res.status(200).json(updatedUser);
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

router.delete("/delete", async (req, res) => {
  const { userId } = req.query;

  try {
    const deletedUser = await Users.deleteUser({ userId: userId as string });

    res.status(200).json(deletedUser);
  } catch (e: any) {
    return res.status(e.code || 500).send({ message: e.message });
  }
});

export default router;
