const express = require("express");
const userUseCase = require("../usecases/user.usecase");

const emailMiddleware = require("../middlewares/email.middleware");
const userMiddleware = require("../middlewares/user.middleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allUsers = await userUseCase.getAll();
    res.json({
      success: true,
      message: "All users",
      data: {
        users: allUsers,
      },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userUseCase.getById(req.params.id);
    res.json({
      success: true,
      message: "user id found",
      data: {
        users: user,
      },
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

//actualizacion de password con email y fecha
router.put("/decodedate", async (req, res) => {
  const { email, fechaNacimiento } = req.body;
  try {
    const user = await userUseCase.getUserByEmailAndDate(
      email,
      fechaNacimiento
    );
    res.status(200).json({
      success: true,
      message: "User authentication successful.",
      data: { user: user.userId },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userUseCase.getByEmail(email);
    res.json({
      success: true,
      message: "User email found",
      data: user,
    });
  } catch (error) {
    res.status(error.status || 500);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = await userUseCase.create(req.body);
    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await userUseCase.getById(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted",
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    const updates = req.body;
    const user = await userUseCase.update(userID, updates);
    res.status(200).json({
      success: true,
      message: "User update",
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userUseCase.login(email, password);
    res.status(200).json({
      success: true,
      message: "User successfuly logged in",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Incorrect email or password",
    });
  }
});

router.get("/verify-email/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Verify", id);

    const isvalid = await userUseCase.checkEmail(id);

    if (!isvalid)
      return res.status(200).json({
        success: false,
        message: "User doesnt validate email",
      });

    res.status(200).json({
      success: true,
      message: "User does validate email",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Incorrect email or password",
    });
  }
});

///users/validate-email
router.post("/email/validate-email", emailMiddleware, async (req, res) => {
  try {
    const { id } = req;
    const validate = await userUseCase.verifyEmail(id);

    res.status(200).json({
      success: true,
      message: "Validate successfull",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Incorrect email or password",
    });
  }
});

router.post("/email/resend", userMiddleware, async (req, res) => {
  try {
    const { user } = req.user;

    const resend = await userUseCase.resendEmail(user);

    res.status(200).json({
      success: true,
      message: "Resend successfull",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Resend failure",
    });
  }
});

router.get("/top/ranking", async (req, res) => {
  try {
    const ranking = await userUseCase.ranking();

    res.status(200).json({
      success: true,
      ranking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Resend failure",
    });
  }
});

// router.post("/login", async (req, res) => {
//   try {
//     const user = ({ email, password } = req.body);
//     // db : body
//     const users = await User.findOne({ email: email });

//     if (!user || !(await User.isValidPassword(password, users.password))) {
//       res.status(401).send({ message: "Invalid email or password" });
//     } else {
//       const token = await User.createToken({
//         _id: user._id,
//         first_name: user.first_name,
//       });
//       res.status(201).send({ message: "Login Success", data: token });
//     }
//   } catch (error) {
//     res.status(400).send({ message: error });
//   }
// });

module.exports = router;
