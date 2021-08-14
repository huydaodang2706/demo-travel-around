const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  //Return user
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", async (req, res) => {
  // console.log(req)
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username has already been taken" });
    }

    const newUser = new User(req.body);
    await newUser.save();
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.json({ success: false, err });
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing email and/or password" });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });

    //  console.log(req.body.password)
    // const isMatch = await user.comparePassword(req.body.password);
    // console.log(isMatch)
    // if (!isMatch)
    //   return res.json({ loginSuccess: false, message: "Wrong password" });
    //   console.log(user)
    // const loginUser = await user.generateToken();
    // res.cookie("w_authExp", loginUser.tokenExp);
    // res.cookie("w_auth", loginUser.token).status(200).json({
    //   loginSuccess: true,
    //   userId: loginUser._id,
    // });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
          success: true
      });
  });
});

module.exports = router;
