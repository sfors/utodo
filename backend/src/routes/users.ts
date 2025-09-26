import express, {Router} from "express";
import {requireAuth} from "../auth/middleware.js";
import users from "../store/users.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);

router.get("/profile", async (req, res) => {
  const userId = req.identity as string;
  const result = await users.getUserById(userId);
  res.json(result);
});

router.post("/profile", async (req, res) => {
  const userId = req.identity as string;
  const {firstName, lastName} = req.body;
  const result = await users.updateUser({id: userId, firstName, lastName});
  res.json(result);
});

export default router;
