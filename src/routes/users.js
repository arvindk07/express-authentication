import { Router } from "express";
import User from "../models/User";
import { customMiddleware } from "../middlewares/custom-middleware";
import { userAuth } from "../middlewares/auth-gaurd";
import { join } from "lodash";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: "Username is allready exist",
      });
    }
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email is already exits",
      });
    }

    const newUser = await User.create({ ...req.body });

    return res.status(201).json({
      message: "Recieved",
      user: newUser.getUser(),
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "User not created.",
      reason: "Invalid user details.",
    });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Username not found" });
    }
    const isMatch = await user.passwordCompare(password);
    if (!isMatch) {
      return res.status(404).json({ message: "UnAuthorised Access" });
    }
    return res.status(200).json({
      message: "You are now logged in",
      success: true,
      token: user.issueToken(),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

router.get("/authenticate", userAuth, async (req, res) => {
  console.log("REQ", req);
  return res.status(200).json({
    user: req.user,
  });
});

// router.get(
//   "/reset-password/:resetPasswordToken",
//   userAuth,
//   async (req, res) => {
//     try {
//       let { resetPasswordToken } = req.params;
//       let user = await User.findOne(resetPasswordToken);
//       if (!user) {
//         throw new Error("User not found with this resetPasswordToken");
//       }
//       return res.sendFile(join(__dirname, "../templates/password-reset.html"));
//     } catch (err) {
//       return res.sendFile(join(__dirname, "../templates/errors.html"));
//     }
//   }
// );

router.post("/login", customMiddleware, async (req, res) => {
  return res.json("hi login");
});

router.post("/test", userAuth, async (req, res) => {
  return res.json("hi login");
});

export default router;
