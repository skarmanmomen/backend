const { registerUser, login, logout, forgotPassword, forgotPasswordTokenVerify, getUserDetails, updatePassword, updpateUserProfile, getSingleUser, getAllUsers, updateUserRole, userDelete } = require("../controllers/userControllers")
const isAutenticated = require("../utils/auth")
const isauthorizedRole = require("../utils/isAuthorizedRole")



const router = require("express").Router()

router.route("/register").post(registerUser)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgot").post(forgotPassword)
router.route("/reset/password/:token").put(forgotPasswordTokenVerify)
router.route("/me").get(isAutenticated, getUserDetails)
router.route("/update/password").put(isAutenticated, updatePassword)
router.route("/update/me").put(isAutenticated, updpateUserProfile)

// admin
router.route("/admin/user/:id").get(isAutenticated, isauthorizedRole("admin"), getSingleUser)
router.route("/admin/users").get(isAutenticated, isauthorizedRole("admin"), getAllUsers)

router.route("/admin/update/role/:id").put(isAutenticated, isauthorizedRole("admin"), updateUserRole)
router.route("/admin/delete/user/:id").delete(isAutenticated, isauthorizedRole("admin"), userDelete)


module.exports = router