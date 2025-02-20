const {
  register,
  login,
  getUser,
  updateUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  idVerification,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authenticate");
const { upload } = require("../middlewares/image-upload");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.put("/update", authenticate, updateUser);
router.get("/", authenticate, getUser);
router.post(
  "/id/verify",
  authenticate,
  upload.single("idImage"),
  idVerification,
);

module.exports = router;
