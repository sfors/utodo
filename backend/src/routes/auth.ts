import express, {Router} from "express";
import users from "./../store/users.js";
import jwt from "./../auth/jwt.js";

const router: Router = express.Router();

router.use(express.json());

router.post("/register", async (req, res) => {
  const {email, firstName, lastName} = req.body;

  const user = await users.getUserByEmail(email);

  if (user) {
    res.status(400).json({error: "User already exists"});
    return;
  }

  //TODO: create registration session in db
  res.status(200).json({message: "Verification code has been sent to your email address"});
});

router.post("/login", async (req, res) => {
  const {email} = req.body;

  //TODO: send verification code and create login session
  res.status(200).json({message: "Verification code has been sent to your email address"});
});

router.post("/verify", async (req, res) => {
  const {email, code} = req.body;

  //TODO: verify code and login/register session
  if (code !== "123456") {
    res.status(401).json({error: "Invalid code"});
    return;
  }

  let user = await users.getUserByEmail(email);

  if (!user) {
    //TODO: take these values from register session
    user = await users.addUser({email, firstName: "", lastName: ""});
  }

  const signedJwt = await jwt.sign({userId: user.id, email: user.email});

  res.status(200).json({user, token: signedJwt});
});

export default router;
