const router = require("express").Router()

const { newOrder, getsingleOrder, myorders, getAllorders, updateOrderStatus, deleteOrder } = require("../controllers/orerControllers")
const isAutenticated = require("../utils/auth")
const isauthorizedRole = require("../utils/isAuthorizedRole")



router.route("/new/order").post(isAutenticated, isauthorizedRole("admin"), newOrder)
router.route("/order/:id").get(isAutenticated, getsingleOrder)
router.route("/myorder").get(isAutenticated, myorders)

router.route("/admin/orders").get(isAutenticated, isauthorizedRole("admin"), getAllorders)
router.route("/admin/order/:id").put(isAutenticated, isauthorizedRole("admin"), updateOrderStatus)
    .delete(isAutenticated, isauthorizedRole("admin"), deleteOrder)

module.exports = router