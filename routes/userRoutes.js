const {
  register,
  login,
  getAllUsers,
  getSingleUser,
  adminLogin,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  confirmEmail,
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  authorizeAdmin,
} = require("../utils/authMiddlewares");
const apiUrl = require("../utils/baseUrl");

const router = require("express").Router();

router.post("/api/user/createUser", register);
router.post("/api/user/login", login);
router.post("/api/user/adminLogin", adminLogin);
router.get("/api/user/allUsers", authorizeAdmin, getAllUsers);
router.get("/api/user", isAuthenticatedUser, getSingleUser);
router.put("/api/user/updateUser", authorizeAdmin, updateUser);
router.put("/api/user/confirmEmail", confirmEmail);
router.delete("/api/user/deleteUser", authorizeAdmin, deleteUser);

router.post("/api/user/forgotPassword", forgotPassword);
router.post("/api/user/resetPassword", resetPassword);

module.exports = router;
