const { createProduct, getAllProducts, updateProduct, deleteProduct, getSingleProduct, createReview, getAllReviews, deleteReview } = require("../controllers/productControllers")
const isAutenticated = require("../utils/auth")
const isauthorizedRole = require("../utils/isAuthorizedRole")



const router = require("express").Router()

//  admin routes
router.route("/admin/product/new")
    .post(isAutenticated, isauthorizedRole("admin"), createProduct)
router.route("/admin/product/:id")
    .put(isAutenticated, isauthorizedRole("admin"), updateProduct)
    .delete(isAutenticated, isauthorizedRole("admin"), deleteProduct)


router.route("/product/:id").get(getSingleProduct)

// user route
router.route("/getreviews/:id").get(getAllReviews)
router.route("/delete/review").delete(isAutenticated, deleteReview)
router.route("/product/reviewadd").post(isAutenticated, createReview)
router.route("/products")
    .get(getAllProducts)

module.exports = router