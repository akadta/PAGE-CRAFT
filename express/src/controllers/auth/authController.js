const prisma = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Fill both",
      });
    }
    const existUser = await prisma.user.findUnique({ where: { email: email } });
    if (!existUser) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const isTrue = await bcrypt.compare(password, existUser.password);

    if (!isTrue) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: existUser.id,
        email: existUser.email,
        name: existUser.name,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login succesfully",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Somethingt went wrong",
      error: err.message,
    });
  }
};
