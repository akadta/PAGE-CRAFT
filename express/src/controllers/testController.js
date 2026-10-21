const prisma = require("../config/prisma");

exports.testDb = async (req, res) => {
  try {
    const user = await prisma.user.findMany();

    if (user.length === 0) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    return res.status(200).json({
      message: "Users found",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};
